"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testable = void 0;
const CANNOT_UNWRAP = 1;
const CANNOT_BURN_FUSES = 2;
const CANNOT_TRANSFER = 4;
const CANNOT_SET_RESOLVER = 8;
const CANNOT_SET_TTL = 16;
const CANNOT_CREATE_SUBDOMAIN = 32;
const PARENT_CANNOT_CONTROL = 64;
const CAN_DO_EVERYTHING = 0;
exports.testable = {
    CANNOT_UNWRAP,
    CANNOT_BURN_FUSES,
    CANNOT_TRANSFER,
    CANNOT_SET_RESOLVER,
    CANNOT_SET_TTL,
    CANNOT_CREATE_SUBDOMAIN,
    PARENT_CANNOT_CONTROL,
};
exports.default = {
    ...exports.testable,
    CAN_DO_EVERYTHING,
};
