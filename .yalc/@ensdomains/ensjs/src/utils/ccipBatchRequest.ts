import {
  BaseError,
  HttpRequestError,
  ccipRequest,
  encodeErrorResult,
  parseAbi,
  type Address,
  type Hex,
} from 'viem'

type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>
}

const errorAbi = parseAbi(['error HttpError((uint16, string)[])'])

type CcipRequestItem = [success: boolean, result: Hex]

const ccipRequestItemHandler = async ([
  wrappedSender,
  wrappedUrls,
  wrappedCallData,
]: [Address, readonly string[], Hex]): Promise<CcipRequestItem> => {
  try {
    const ccipResult = await ccipRequest({
      sender: wrappedSender,
      urls: wrappedUrls,
      data: wrappedCallData,
    })
    return [false, ccipResult]
  } catch (e) {
    if (e instanceof HttpRequestError) {
      return [
        true,
        encodeErrorResult({
          abi: errorAbi,
          errorName: 'HttpError',
          args: [[[e.status || 500, e.details]]],
        }),
      ]
    }
    return [
      true,
      encodeErrorResult({
        abi: errorAbi,
        errorName: 'HttpError',
        args: [[[500, e instanceof BaseError ? e.details : 'Unknown Error']]],
      }),
    ]
  }
}

export const ccipBatchRequest = async (
  callDatas: ReadonlyDeep<[Address, string[], Hex][]>,
) => {
  const ccipRequestCache: Map<string, Promise<CcipRequestItem>> = new Map()
  const responsePromises: Promise<CcipRequestItem>[] = []

  for (let i = 0; i < callDatas.length; i += 1) {
    const [wrappedSender, wrappedUrls, wrappedCallData] = callDatas[i]
    const requestId = JSON.stringify([
      wrappedSender,
      wrappedUrls,
      wrappedCallData,
    ])

    const existingRequest = ccipRequestCache.get(requestId)
    if (existingRequest) {
      responsePromises.push(existingRequest)
      // eslint-disable-next-line no-continue
      continue
    }

    const ccipRequestPromise = ccipRequestItemHandler([
      wrappedSender,
      wrappedUrls,
      wrappedCallData,
    ])
    ccipRequestCache.set(requestId, ccipRequestPromise)
    responsePromises.push(ccipRequestPromise)
  }

  const awaitedResponses = await Promise.all(responsePromises)

  return awaitedResponses.reduce(
    ([failures, responses], [failure, response], i) => {
      failures[i] = failure
      responses[i] = response
      return [failures, responses] as [failures: boolean[], responses: Hex[]]
    },
    [[], []] as [failures: boolean[], responses: Hex[]],
  )
}
