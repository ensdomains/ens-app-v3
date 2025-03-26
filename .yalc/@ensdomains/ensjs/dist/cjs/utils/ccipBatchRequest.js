"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccipBatchRequest = void 0;
const viem_1 = require("viem");
const errorAbi = (0, viem_1.parseAbi)(['error HttpError((uint16, string)[])']);
const ccipRequestItemHandler = async ([wrappedSender, wrappedUrls, wrappedCallData,]) => {
    try {
        const ccipResult = await (0, viem_1.ccipRequest)({
            sender: wrappedSender,
            urls: wrappedUrls,
            data: wrappedCallData,
        });
        return [false, ccipResult];
    }
    catch (e) {
        if (e instanceof viem_1.HttpRequestError) {
            return [
                true,
                (0, viem_1.encodeErrorResult)({
                    abi: errorAbi,
                    errorName: 'HttpError',
                    args: [[[e.status || 500, e.details]]],
                }),
            ];
        }
        return [
            true,
            (0, viem_1.encodeErrorResult)({
                abi: errorAbi,
                errorName: 'HttpError',
                args: [[[500, e instanceof viem_1.BaseError ? e.details : 'Unknown Error']]],
            }),
        ];
    }
};
const ccipBatchRequest = async (callDatas) => {
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
exports.ccipBatchRequest = ccipBatchRequest;
//# sourceMappingURL=ccipBatchRequest.js.map