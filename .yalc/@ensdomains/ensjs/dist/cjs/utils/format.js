"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var format_exports = {};
__export(format_exports, {
  bracketFormat: () => bracketFormat,
  formatHashed: () => formatHashed,
  truncateFormat: () => truncateFormat
});
module.exports = __toCommonJS(format_exports);
const formatHashed = (name) => name.replace(/(\[)(.{64})(\])/g, "0x$2");
const truncateFormat = (name) => name.replace(/(\[.{3})(.{58})(.{3}\])/g, "$1...$3");
const bracketFormat = (name) => name.replace(/(0x)(.{64})(?=\.)/g, "[$2]");
