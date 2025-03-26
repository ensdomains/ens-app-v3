import { BaseError, HttpRequestError, ccipRequest, encodeErrorResult, parseAbi, } from 'viem';
const errorAbi = parseAbi(['error HttpError((uint16, string)[])']);
const ccipRequestItemHandler = async ([wrappedSender, wrappedUrls, wrappedCallData,]) => {
    try {
        const ccipResult = await ccipRequest({
            sender: wrappedSender,
            urls: wrappedUrls,
            data: wrappedCallData,
        });
        return [false, ccipResult];
    }
    catch (e) {
        if (e instanceof HttpRequestError) {
            return [
                true,
                encodeErrorResult({
                    abi: errorAbi,
                    errorName: 'HttpError',
                    args: [[[e.status || 500, e.details]]],
                }),
            ];
        }
        return [
            true,
            encodeErrorResult({
                abi: errorAbi,
                errorName: 'HttpError',
                args: [[[500, e instanceof BaseError ? e.details : 'Unknown Error']]],
            }),
        ];
    }
};
export const ccipBatchRequest = async (callDatas) => {
    const ccipRequestCache = new Map();
    const responsePromises = [];
    for (let i = 0; i < callDatas.length; i += 1) {
        const [wrappedSender, wrappedUrls, wrappedCallData] = callDatas[i];
        const requestId = JSON.stringify([
            wrappedSender,
            wrappedUrls,
            wrappedCallData,
        ]);
        const existingRequest = ccipRequestCache.get(requestId);
        if (existingRequest) {
            responsePromises.push(existingRequest);
            // eslint-disable-next-line no-continue
            continue;
        }
        const ccipRequestPromise = ccipRequestItemHandler([
            wrappedSender,
            wrappedUrls,
            wrappedCallData,
        ]);
        ccipRequestCache.set(requestId, ccipRequestPromise);
        responsePromises.push(ccipRequestPromise);
    }
    const awaitedResponses = await Promise.all(responsePromises);
    return awaitedResponses.reduce(([failures, responses], [failure, response], i) => {
        failures[i] = failure;
        responses[i] = response;
        return [failures, responses];
    }, [[], []]);
};
//# sourceMappingURL=ccipBatchRequest.js.map