const should = require('chai').should()
const expect = require('chai').expect
const contentHash = require('../src/index.js')

const ipfs_CIDv0 = 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4'
const ipfs_CIDv1 = 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4'
const ipfs_contentHash = 'e3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f'
const ipns_CIDv1 = 'k2k4r8kgnix5x0snul9112xdpqgiwc5xmvi8ja0szfhntep2d7qv8zz3'
const ipns_peerID_B58_contentHash = 'e5010172122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f'
const ipns_peerID_B58 = '12D3KooWG4NvqQVczTrWY1H2tvsJmbQf5bbA3xGYXC4FM3wWCfE4'
const ipns_libp2pKey_CIDv1 = 'k51qzi5uqu5dihst24f3rp2ej4co9berxohfkxaenbq1wjty7nrd5e9xp4afx1'
const ipns_ED25519_contentHash = 'e50101720024080112205cbd1cc86ac20d6640795809c2a185bb2504538a2de8076da5a6971b8acb4715'
const swarm = 'd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
const swarm_contentHash = 'e40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
const onion = 'zqktlwi4fecvo6ri'
const onion_contentHash = 'bc037a716b746c776934666563766f367269';
const onion3 = 'p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd';
const onion3_contentHash = 'bd037035336c663537716f7679757677736336786e72707079706c79337674716d376c3670636f626b6d797173696f6679657a6e667535757164';
const ipfsBase32DagPb = 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4';
const ipfsBase32Libp2pKey = 'bafzbeie5745rpv2m6tjyuugywy4d5ewrqgqqhfnf445he3omzpjbx5xqxe';
const skylink = 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg'
const skylink_contentHash = '90b2c60508004007fd43b74149b31aacbbf2784e874d09b086bed15fd54cacff7120cce95372'
const arweave = 'ys32Pt8uC7TrVxHdOLByOspfPEq2LO63wREHQIM9SJQ'
const arweave_contentHash = '90b2ca05cacdf63edf2e0bb4eb5711dd38b0723aca5f3c4ab62ceeb7c1110740833d4894'
describe('content-hash (legacy tests)', () =>
	{
		it('should decode a content hash', () => {
			const actual_0 = contentHash.decode(ipfs_contentHash);
			const actual_1 = contentHash.decode(swarm_contentHash);
			let actual_2 = contentHash.decode(onion_contentHash);

			actual_0.should.be.equal(ipfs_CIDv1);
			actual_1.should.be.equal(swarm);
			actual_2.should.be.equal(onion);
		});
		it('should encode an ipfs address (CIDv0)', () => {
			const actual = contentHash.fromIpfs(ipfs_CIDv0);
			actual.should.be.equal(ipfs_contentHash);
		});
		it('should encode an ipfs address (CIDv1)', () => {
			const actual = contentHash.fromIpfs(ipfs_CIDv1);
			actual.should.be.equal(ipfs_contentHash);
		});
		it('should encode a swarm address', () => {
			const actual = contentHash.fromSwarm(swarm);
			actual.should.be.equal(swarm_contentHash);
		});
		it('should encode an onion address', () => {
			const actual = contentHash.encode('onion', onion);
			actual.should.be.equal(onion_contentHash);
		});
		it('should get a codec from a content hash', () => {
			const actual_0 = contentHash.getCodec(ipfs_contentHash);
			const actual_1 = contentHash.getCodec(swarm_contentHash);
			const actual_2 = contentHash.getCodec(onion_contentHash);

			actual_0.should.be.equal('ipfs-ns');
			actual_1.should.be.equal('swarm-ns');
			actual_2.should.be.equal('onion');
		});
	}
);

describe('content-hash', () => {
	describe('swarm', () => {
		it('should encode', () => {
			const actual = contentHash.encode('swarm-ns', swarm);
			actual.should.be.equal(swarm_contentHash);
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(swarm_contentHash);
			actual.should.be.equal('swarm-ns');
		});
		it('should decode', () => {
			const actual = contentHash.decode(swarm_contentHash);
			actual.should.be.equal(swarm);
		});
	});
	describe('ipfs', () => {
		it('should encode CIDv0', () => {
			const actual = contentHash.encode('ipfs-ns', ipfs_CIDv0);
			actual.should.be.equal(ipfs_contentHash);
		});
		it('should encode CIDv1', () => {
			const actual = contentHash.encode('ipfs-ns', ipfs_CIDv1);
			actual.should.be.equal(ipfs_contentHash);
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(ipfs_contentHash);
			actual.should.be.equal('ipfs-ns');
		});
		it('should decode to CIDv1', () => {
			const actual = contentHash.decode(ipfs_contentHash);
			actual.should.be.equal(ipfs_CIDv1);
		});
	});
	describe('ipns', () => {
		it('should encode legacy PeerID (RSA B58)', () => {
			// RSA ones lookes like regular multihashes
			const actual = contentHash.encode('ipns-ns', ipfs_CIDv0);
			actual.should.be.equal(ipns_peerID_B58_contentHash);
		});
		it('should encode ED25519 PeerID (B58)', () => {
			// ED25519 are allowed to be encoded in Base58 for backward-interop
			const actual = contentHash.encode('ipns-ns', ipns_peerID_B58);
			actual.should.be.equal(ipns_ED25519_contentHash);
		});
		it('should encode PeerID (CIDv1)', () => {
			// libp2p-key as CID is the current canonical notation:
			// https://github.com/libp2p/specs/blob/master/RFC/0001-text-peerid-cid.md
			const actual = contentHash.encode('ipns-ns', ipns_libp2pKey_CIDv1);
			actual.should.be.equal(ipns_ED25519_contentHash);
		});
		it('should refuse to encode non-libp2p-key value inlined as identity multihash', () => {
			expect(() => contentHash.encode('ipns-ns', '12uA8M8Ku8mHUumxHcu7uee')).to.throw('ipns-ns allows only valid cryptographic libp2p-key identifiers, try using ED25519 pubkey instead')
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(ipns_ED25519_contentHash);
			actual.should.be.equal('ipns-ns');
		});
		it('should decode legacy PeerID to CIDv1 with libp2p-key codec', () => {
			const actual = contentHash.decode(ipns_peerID_B58_contentHash);
			actual.should.be.equal(ipns_CIDv1);
		});
		it('should decode ED25519 to CIDv1 with libp2p-key codec', () => {
			const actual = contentHash.decode(ipns_ED25519_contentHash);
			actual.should.be.equal(ipns_libp2pKey_CIDv1);
		});
		it('should decode deprecated DNSLink identifiers', () => {
			// DNSLink is fine to be used before ENS resolve occurs, but should be avoided after
			// Context: https://github.com/ensdomains/ens-app/issues/849#issuecomment-777088950
			// For now, we allow decoding of legacy values:
			const deprecated_dnslink_contentHash = 'e5010170000f6170702e756e69737761702e6f7267'
			const deprecated_dnslink_value = 'app.uniswap.org'
			const actual = contentHash.decode(deprecated_dnslink_contentHash)
			actual.should.be.equal(deprecated_dnslink_value)
		});
	});
	describe('onion', () => {
		it('should encode', () => {
			const actual = contentHash.encode('onion', onion);
			actual.should.be.equal(onion_contentHash);
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(onion_contentHash);
			actual.should.be.equal('onion');
		});
		it('should decode', () => {
			const actual = contentHash.decode(onion_contentHash);
			actual.should.be.equal(onion);
		});
	});
	describe('onion3', () => {
		it('should encode', () => {
			const actual = contentHash.encode('onion3', onion3);
			actual.should.be.equal(onion3_contentHash);
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(onion3_contentHash);
			actual.should.be.equal('onion3');
		});
		it('should decode', () => {
			const actual = contentHash.decode(onion3_contentHash);
			actual.should.be.equal(onion3);
		});
	});

	describe('skynet', () => {
		it('should encode', () => {
			const actual = contentHash.encode('skynet-ns', skylink);
			actual.should.be.equal(skylink_contentHash);
		});
		it('should getCodec', () => {
			const actual = contentHash.getCodec(skylink_contentHash);
			actual.should.be.equal('skynet-ns');
		});
		it('should decode', () => {
			const actual = contentHash.decode(skylink_contentHash);
			actual.should.be.equal(skylink);
		});
	});

  describe('arweave', () => {
    it('should encode', () => {
        const actual = contentHash.encode('arweave-ns', arweave);
        actual.should.be.equal(arweave_contentHash);
    });
    it('should getCodec', () => {
        const actual = contentHash.getCodec(arweave_contentHash);
        actual.should.be.equal('arweave-ns');
    });
    it('should decode', () => {
        const actual = contentHash.decode(arweave_contentHash);
        actual.should.be.equal(arweave);
    });
  });
	describe('helpers.cidV0ToV1Base32', () => {
		const { cidV0ToV1Base32 } = contentHash.helpers;
		it('should convert CID v0 into v1', () => {
			const actual = cidV0ToV1Base32(ipfs_CIDv0);
			actual.should.be.equal(ipfsBase32DagPb);
		});
		it('should keep CID v1 Base32 as-is', () => {
			const dagPbCid = cidV0ToV1Base32(ipfsBase32DagPb);
			dagPbCid.should.be.equal(ipfsBase32DagPb);
			const libp2pKeyCid = contentHash.helpers.cidV0ToV1Base32(ipfsBase32Libp2pKey);
			libp2pKeyCid.should.be.equal(ipfsBase32Libp2pKey);
		});
	});

	describe('helpers.cidForWeb', () => {
		const { cidForWeb } = contentHash.helpers;
		it('should convert CIDv0 into case-insenitive base', () => {
			const actual = cidForWeb(ipfs_CIDv0);
			actual.should.be.equal(ipfsBase32DagPb);
		});
		it('should keep CIDv1 Base32 if under DNS limit', () => {
			const b32_59chars = 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4';
			const webCid = cidForWeb(b32_59chars);
			webCid.should.be.equal(b32_59chars);
		});
		it('should convert to Base36 if it helps with DNS limit', () => {
			const b32_65chars = 'bafzaajaiaejca4syrpdu6gdx4wsdnokxkprgzxf4wrstuc34gxw5k5jrag2so5gk';
			const b36_62chars = 'k51qzi5uqu5dj16qyiq0tajolkojyl9qdkr254920wxv7ghtuwcz593tp69z9m';
			const webCid = cidForWeb(b32_65chars);
			webCid.should.be.equal(b36_62chars);
		});
		it('should throw if CID is over DNS limit', () => {
			const b32_sha512_110chars = 'bafkrgqhhyivzstcz3hhswshfjgy6ertgmnqeleynhwt4dlfsthi4hn7zgh4uvlsb5xncykzapi3ocd4lzogukir6ksdy6wzrnz6ohnv4aglcs';
			expect(() => cidForWeb(b32_sha512_110chars)).to.throw(TypeError, 'CID is longer than DNS limit of 63 characters and is not compatible with public gateways');
		});
	});
});