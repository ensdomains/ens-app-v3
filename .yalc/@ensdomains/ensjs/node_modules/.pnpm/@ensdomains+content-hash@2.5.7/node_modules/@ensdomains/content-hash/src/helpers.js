/*
	ISC License

	Copyright (c) 2019, Pierre-Louis Despaigne

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted, provided that the above
	copyright notice and this permission notice appear in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

const CID = require('cids');

// Label's max length in DNS (https://tools.ietf.org/html/rfc1034#page-7)
const dnsLabelMaxLength = 63;

/**
 * Take any ipfsHash and convert it to DNS-compatible CID
 * @param {string} ipfsHash a regular ipfs hash either a cid v0 or v1
 * @return {string} the resulting ipfs hash as a cid v1
 */
const cidForWeb = (ipfsHash) => {
	let cid = new CID(ipfsHash);
	if (cid.version === 0) {
		cid = cid.toV1();
	}
  let dnsLabel = cid.toString('base32');
  if (dnsLabel.length > dnsLabelMaxLength) {
    const b36 = cid.toString('base36');
    if (b36.length <= dnsLabelMaxLength) {
      return b36;
    }
    throw new TypeError ('CID is longer than DNS limit of 63 characters and is not compatible with public gateways');
  }
	return dnsLabel;
}

exports.cidForWeb = cidForWeb;


/**
 * Take any ipfsHash and convert it to a CID v1 encoded in base32.
 * @param {string} ipfsHash a regular ipfs hash either a cid v0 or v1 (v1 will remain unchanged)
 * @return {string} the resulting ipfs hash as a cid v1
 */
const cidV0ToV1Base32 = (ipfsHash) => {
	let cid = new CID(ipfsHash);
	if (cid.version === 0) {
		cid = cid.toV1();
	}
	return cid.toString('base32');
}

exports.cidV0ToV1Base32 = cidV0ToV1Base32;
