export default async function ({ getProfile }, name, options) {
    if (!name.includes('.')) {
        throw new Error('Input is not an ENS name');
    }
    return await getProfile(name, options);
}
