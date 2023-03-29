// src/utils/format.ts
var formatHashed = (name) => name.replace(/(\[)(.{64})(\])/g, "0x$2");
var truncateFormat = (name) => name.replace(/(\[.{3})(.{58})(.{3}\])/g, "$1...$3");
var bracketFormat = (name) => name.replace(/(0x)(.{64})(?=\.)/g, "[$2]");
export {
  bracketFormat,
  formatHashed,
  truncateFormat
};
