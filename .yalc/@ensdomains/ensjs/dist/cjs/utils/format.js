"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bracketFormat = exports.truncateFormat = exports.formatHashed = void 0;
const formatHashed = (name) => name.replaceAll(/(\[)(.{64})(\])/g, '0x$2');
exports.formatHashed = formatHashed;
const truncateFormat = (name) => name.replaceAll(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3');
exports.truncateFormat = truncateFormat;
const bracketFormat = (name) => name.replaceAll(/(0x)(.{64})(?=\.)/g, '[$2]');
exports.bracketFormat = bracketFormat;
