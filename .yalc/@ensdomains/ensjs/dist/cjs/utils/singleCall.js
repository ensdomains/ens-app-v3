"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (provider, ensData, func, ...data) => func
    .raw(ensData, ...data)
    .then((rawData) => provider.call(rawData))
    .catch(() => null)
    .then((ret) => func.decode(ensData, ret, ...data));
