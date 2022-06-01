export default async (provider, ensData, func, ...data) =>
  func
    .raw(ensData, ...data)
    .then((rawData) => provider.call(rawData))
    .catch(() => null)
    .then((ret) => func.decode(ensData, ret, ...data))
