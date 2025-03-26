"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateFormat = void 0;
const truncateFormat = (name) => name.replace(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3');
exports.truncateFormat = truncateFormat;
//# sourceMappingURL=format.js.map