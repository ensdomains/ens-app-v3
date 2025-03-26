"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDnsTxtRecords = void 0;
const getDnsTxtRecords = async ({ name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const response = await fetch(`${endpoint}?name=${name}.&type=TXT&do=1`, {
        method: 'GET',
        headers: {
            accept: 'application/dns-json',
        },
    }).then((res) => res.json());
    return response;
};
exports.getDnsTxtRecords = getDnsTxtRecords;
//# sourceMappingURL=getDnsTxtRecords.js.map