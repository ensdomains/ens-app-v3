export const formatHashed = (name) => name.replaceAll(/(\[)(.{64})(\])/g, '0x$2');
export const truncateFormat = (name) => name.replaceAll(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3');
export const bracketFormat = (name) => name.replaceAll(/(0x)(.{64})(?=\.)/g, '[$2]');
