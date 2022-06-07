export const formatHashed = (name) => name.replace(/(\[)(.{64})(\])/g, '0x$2');
export const truncateFormat = (name) => name.replace(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3');
export const bracketFormat = (name) => name.replace(/(0x)(.{64})(?=\.)/g, '[$2]');
