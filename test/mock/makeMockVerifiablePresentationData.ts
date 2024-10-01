/* eslint-disable @typescript-eslint/naming-convention */

import { match } from 'ts-pattern'

const types = ['openid']

type MakeMockVerifiablePresentationDataType = (typeof types)[number]

export const makeMockVerifiablePresentationData = (type: MakeMockVerifiablePresentationDataType) =>
  match(type)
    .with('openid', () => ({
      vp_token: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedDiscordAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-discord-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/Vm6tnGd2VuxXPnHE5sHocn#14',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/Vm6tnGd2VuxXPnHE5sHocn',
            revocationListIndex: '14',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Discord',
            credentialType: 'Verified Account',
            name: 'storywithoutend',
          },
          issuanceDate: '2024-07-16T14:55:51Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-07-16T14:55:51Z',
            nonce: 'sxHLmiub2N6P83j2KjisFhLz1ljV859QIXbxqK1EZ5o=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABID//+T/Wtpd0kIPG66vUxLPQh/fJxwrs7qsm6OkvnOG7vJIa4QvthVLlCGXEiEGhGO27yGw1GZyZDKS2Ks3n9maDg5qnenoOTEikTn018bFDF2yVGvwRtT0sibz7bLMLxVi1WPAvf/H+qtAMgEiE2ecEot19sW7btVspxLXWfzhut4mGjm8rzV+U+8MxfwX3ajy+UAAAB0j8Ng52sdxO9ZenDx+fG/eXUSuKAnFoUGZieY3zZ+lESCpJQR6y4XPivRfA+bthtRAAAAAjIKEm/Rq3B9sp4+Gc4/4RJxqoDq/U5dFx+L3b9FVq63EiAjxZwOZlms8bKp8cpBoWfyqkgha2FtDIE9NcsTaAKhQ9M1oOWm2Z+fjkycv7PJWx8qxSXeE/17GL0IqfunhdtavMnnWWg8/+hxld6bohMAAAACLGNx//msfsj28UGcqmYpRk8TprZBJ3qAYBwFdFJhTZlCqHTMWyIjSr9zAtoqyqbLSI0wxA+i2WPZqOoQ3CR25A==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedPersonhood', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-identity',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/Fb5bQhTMTRt57yE6MDBZNw#511',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/Fb5bQhTMTRt57yE6MDBZNw',
            revocationListIndex: '511',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            age: 49,
            documentVerified: 'Driver License',
            name: 'Leslie Knope',
          },
          issuanceDate: '2024-07-17T07:20:42Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-07-17T07:20:42Z',
            nonce: 'Ifx46n42mAAVZ6ulobtvVaUC8WyT4bi2u+4MM3xKDgQ=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABY/0f+ulgsOvEnV+RaRmcn095Ja68t0wREQgn6UKybH5nRk4kx1nYCGEzxtnjP4B2SHLOiFaRiD/TbHHjmlA+kG9P1/imNW5HC8z3le4NhSaaN7WgRHYWbkL6Rhw+NuixFeIk61Yx34lCtE+O9PdfeK0MwdMBDkIYh4vnuq4pWEHgcMguGUylWetjSYveZu6qtiQ6YAAAB0rZMvWrDDniOd63oidVLwbnYWe6FbDF2BquY31V7H1oLpKYM8PDf1eWRdPahspeuxAAAAAjyk36PYyGSjoi9DVEBmbbmdzcZVczGp1MgrVrRTonp9FFmXv9SlHVZDpL3uIeVbQtk3VVBcCW16cQslg2Yz/W+gTzUuri97P4/41XBkEuUsgJIL6C8p4rAk4gRvJgON3A2QFlrGk9xOBIns+DCnq2IAAAAGRletO34bQWcQqloj5hAukLTOtd8mwGVvqKYnd/XAawYGuJnKBSJ5YPbC5WHFaHom4bOswh75KkQ3l6GyPNFpYzpJsSaTwmaVsvtbgDrhrSk2RvaL/NgOQTX77bjqYvxPRyrZf90FdqEVywujU4TGxRzmWAyK662x1puztFeZ1lQPwgBxQjL6kSKqOLlz69bYBl9WXl969L/Vfa60MpigjQfh11POVH6QaT9DniDs2W44t5itB0VcQLhZjcM7weXc',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedTelegramAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-telegram-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/5waLGAknxpfxyjk29cRvjG#2',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/5waLGAknxpfxyjk29cRvjG',
            revocationListIndex: '2',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Dentity',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'Chu',
            verificationSource: 'Telegram',
          },
          issuanceDate: '2024-07-17T08:18:34Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-07-17T08:18:34Z',
            nonce: '961cj8WEPEuEZ03SK4fyvZ85/ojaakaugq2bZhHljy8=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABQP//+CiHlynm1gp1r7MJJy5MIST78Y47PoI46bv0n+H1pO70trrDKSTFUn2n1h54zZFbSsDtBTQz65WJuskwvMktRVJlTaj3S82eSsg8SGJNR5Us2Pbrua1oqcWUX1LiyWj7uGrbeaIevZrPsu/96BEAIm+0H/Th0nUxxARAp2v7EG2z5Dnz16jAEDpY9J8rmz51kAAAB0sE74+o5n+nupgc6JERwyidUzhhkyLLjc7nxIElXxFVsmS2ZYnB/F9y+WUqYhTDARAAAAAlFRl4fjF6GAA5IEXPqYLa53GySsd3EI7pHuyJqKyvdbB0eTPY3hXZFfDfwxXx0uIQe6QPnAbVQM5+LNPbzxlQeuZfNYTIHhzP9euB3IwTHw8G8tOYvr6wvfF+kA3tJ1R00NVAOGHDGHdleggt0f27MAAAACWKk7zZOGNju6GYTAiqo7Xi/3rJhAsGAeSKdSB4po/EtSu5nPQeURZQWXNvZL3BV76kNhpfWhjYMKGBoRDHOWPw==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedGoogleAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-google-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/66x8MW5FsfRZNjdkeApbmG#18',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/66x8MW5FsfRZNjdkeApbmG',
            revocationListIndex: '18',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Google',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'Huong Nguyen',
          },
          issuanceDate: '2024-08-05T04:14:59Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-05T04:14:59Z',
            nonce: 'EuShXg9qVBZ6GiBmlQs9EwliBCwPlxfB/rbA8zucfp4=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABMH//+noiQUgWUPGYFUsJawjMrugiDp4v9Qh+tNNXEJb03ndXMw4homMhFqN/Ak0OteUJyCy77FMFUx2LOWn1ArSY+D1v48u01k5BhoMkev5ybMet4lISaTy6IZA3+zlCq7F0uRRyWcfwp4dofPLlVv3uNzYSmsiz/jHmVR/bt/AwcJ+UgA1kAsJUweFUYWn15WNacAAAB0q+5UGezNdofZxiCwioflOxeOqksGSeuugj+2F8H5jiW4nthUgQXZqpUOyCbbOz1vAAAAAiYPT6JKlpO3vVioATI0yLSLSHL61RKpcCMcodgI0sQuU6WkU4+xJzaEBFyzNbpbjF0jXWymxXBKuzZCtQxGixm4PF7lEVVYcg30Ws/WykqwhvBOCP5OEHHG0Eu+u8xOXkOClLRrROF3iSvEwOpylNEAAAACHSNvhVJbDGNeQGu+nJ65ShwYbIBMZEKKuA3YAIf65IIbliqM/SHgZ2reOWyUnkYeRdMSmHjRz9dWXYGL/XZs8w==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedLinkedinAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-linkedin-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/3XPK4aXXRF8kbYWQZoShiC#13',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/3XPK4aXXRF8kbYWQZoShiC',
            revocationListIndex: '13',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'LinkedIn',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'Huong Nguyen Thi Thu',
          },
          issuanceDate: '2024-08-05T04:17:17Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-05T04:17:18Z',
            nonce: 'KaeHKujKycbOgM5q3maTvBn55+c2nN6ooQBiz5KhcE4=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABMH//+gk0iKOPD3AslN3iP5qN+6zIkvy4qnTmuv/l+lhBhHoGusTO7PTllvtUk98sPgJXOXEWSoe22HEivWeQApdr8IrsEqDwWwj1biwz9vzKZ/TShrhY8nezFobM8dTkKceCaSvdROxJVgug0W7oFu4CEULCW4f/CyKG4LE6LbmgYBDi5qHO1rDphWYOBUxjx5t8kAAAB0uEuqIaYWL6xONORWRm5Xrsnbx2MJnr3XhhL+lpTueRoIO+2ttK5ahgzwyFDTvaJdAAAAAjRPKMZteIPHi6kkoYHCQWKC+rO/ag+VZPbGUyzmKljra/gBYlAovJZZZG2D9T3m3Ku2Pp8Z3LgF8YCJ3w2R6UumHflTAObYtALzSaCa8WmlVjLDJfJmu6/GDEiKg6WYw4z//nSa7khBUOMEunOpX0cAAAACFosIk6cf5LaNKs5XPjosmWDCxhaeHFbfVSvmTkRiIAY+EjFYTtMzvWeJLL764REFUj1sLA0xL6TGd274cTjLtw==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedTwitterAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-twitter-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/BEDD8gWYHvS3W2qVwTkC2Y#46',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/BEDD8gWYHvS3W2qVwTkC2Y',
            revocationListIndex: '46',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Dentity',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'davidchu.eth',
            username: 'davidchuETH',
            verificationSource: 'Twitter',
          },
          issuanceDate: '2024-08-06T04:38:41Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-06T04:38:41Z',
            nonce: '9hSkfMwPOfvVU0IDRKN42wpF0Xs8PRXzrLkU7tsBK2A=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABUf//+UBjINHjTt1ibu8bP8tmP+0LHI1SveB9mqcoATWHEzvf2PWnoxbhHg3+7027uIwHKGUEMQ1zxTLSfrFdCZkPqWIyBBoQsOwn8BstSCs5sAepokj0Jk79XWm2cyChj73QCgHKq2zYcTePALulweXAiX6tjSwOZcIcBraHeSUoL6YV/swL0I4IkovkjrBtolG00AAAB0o6hdaMDbhNSCQqsrSKb7DTlcVLpeqQ7SbiLl/pVKtO16KFgQmyFGIa8wgl+lgvrJAAAAAld8yhbY6WApV/nYA2u26mIlTR8AcQPXufSwsDQBDPQqQNtBwETfLWDgWvs48VSv1my5jL9DnKo0zEavLqKME5Ch+v9AfcTXWoLKp2Fsn0GRGNOTVwJ1BIcr79Qnv9C7bP7OpLsDjYtO86dMT/hULAsAAAACF5e3XbBQFop1AGCgT/CwTHrXeqj1hasCVWmnktwc8lc4L/GtBppsEacITFsi4DjUcFLh008dMTjLCdi7toxP+g==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedDiscordAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-discord-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/Vm6tnGd2VuxXPnHE5sHocn#53',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/Vm6tnGd2VuxXPnHE5sHocn',
            revocationListIndex: '53',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Dentity',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'storywithoutend',
            verificationSource: 'Discord',
          },
          issuanceDate: '2024-08-18T13:34:04Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-18T13:34:04Z',
            nonce: 's5hCIAUYfJWjotnwonqv32525RiRYMzrOc/wi4hhoo8=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABQP//+tdWPYOUW+2Z9QPOhdciufQAikASgdqsyfWpv4SyeC/7r7pHwvNWmLfjSDmRhJ2quMchPo1GhOUhe3Vj9Mk5gTxGRAV6RPAyhRgSYlNhj+zOQOgBw4DMEoikR1j+Va79CNBnO3oq88TystHS0y3mdm9sr8lEl+eLs2Ool+FjXTucAniQ0+d41+dyYINg2MgzYAAAB0hAexB6k5oi6t7v58Z/f5edLK5qtPx+bnTXUIJhDwEjGFS+7sjepZRM7eqDH7oo1MAAAAAkxdQUaN8MENYr5EI8fuujj00XCyJ43XMA/ssW6T5TtNGQBQfDqBbGnhtRfy7Ky8GquzPnhqapkFRgTSq+XrrbCmGMZO/WwU16JWQDvsb9Xzx+07dGDKBgGB35lMt3SIr+tTs5cmYkcX7xNI5P75zc8AAAACZQ4luGr7G2KyCbvVh58YIDsNiuo6TjUGP8BzLybDWfRqhGqCfwgK6APUhGfYJQP6LXQvyjHs54DIusRHlGSS2Q==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        null,
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedENS', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-ens',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/MKvHUgNRTERw2yMnTtJWTH#11',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/MKvHUgNRTERw2yMnTtJWTH',
            revocationListIndex: '11',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Dentity',
            credentialType: 'Verified ENS',
            ensName: 'davidchu.eth',
            ethAddress: '0x538E35B2888eD5bc58Cf2825D76cf6265aA4e31e',
          },
          issuanceDate: '2024-08-20T03:51:11Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-20T03:51:11Z',
            nonce: 'YZdt6OU8ewvKkjo4wWv8wKGwp7lQYg2iHU2s0SYQFQE=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABMH//+KEV8i7iqMi4Z02x7FGgej/crhc4Bqj1Cc3HOVKWd0YUMmHvh0siYWTrDOYgZB8F6IrvsamYUfOIMTakQ1gUTDmQnwP+cTgYzNqPe0zR8imnEgyrmVVrjZ3tcg9QYM56OUdtXE/ZRPh0XZ25Mn6ndl/BzeopMOXAIYatZ2oC2Zzb5/roomcfLpEbsmR3IyPEIAAAB0mdCN9KLcsW/i/9sdbgArf3k+k8Xl+5xrExE6TLZFcSP43uSKqEr8sgfNn8DlyREbAAAAAi3bWtzEoSg3d9H/Svl0W2EfaVFHuLKWUt0NecS3r5oYAojmeX1brbUf8CJX7cdY/XUx19NdkD/q27EMf4SNwJeO7lVNZEvevXKSC55S2Xv7QNxwkSK431QxZoXtDHP85EIJtPBrwiIgbkRyO2REdTYAAAACF6k+tKiFW2NwNXRulPD4fbPbPixe2ZhwOCrAskyvaptQTDl5G7Zs2IZWBWYREH+YFq8U/ga8hWG6oad1/ADWNg==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/bbs/v1',
            {
              '@vocab': 'https://trinsic.cloud/dentity-staging/',
            },
          ],
          id: 'urn:vc',
          type: ['VerifiedXAccount', 'VerifiableCredential'],
          credentialSchema: {
            id: 'https://schema.trinsic.cloud/dentity-staging/verified-x-account',
            type: 'JsonSchemaValidator2018',
          },
          credentialStatus: {
            id: 'https://dentity-staging.connect.trinsic.cloud/credential-status/WjvngSuFaPhuCHKWFJ8ew6#82',
            type: 'RevocationList2020Status',
            revocationListCredential:
              'https://dentity-staging.connect.trinsic.cloud/credential-status/WjvngSuFaPhuCHKWFJ8ew6',
            revocationListIndex: '82',
          },
          credentialSubject: {
            id: 'urn:vc:subject:0',
            credentialIssuer: 'Dentity',
            credentialType: 'Verified Account',
            holderFullName: 'Leslie Knope',
            name: 'davidchu.eth',
            username: 'davidchuETH',
            verificationSource: 'X',
          },
          issuanceDate: '2024-08-20T03:58:31Z',
          issuer: 'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw',
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2024-08-20T03:58:31Z',
            nonce: 't6icYbF3vgKgsU9he/N/nONSeZapPIJiHsC9bOS2+MY=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'ABUf//+4xbHCcN8Xy8vIu6HRIa0BcgfYYoSkBjfw7NGFnzCN6az4DMAHX7BkVvalFI9+bNeNcEbq/xaez6ZKgS14Gge1n2fmPQYBoUK/tv+4ntqkmXB//+e2Zf/f1ZarYkgfO+65CMhKc7MP/PP+BXCK3VEYEdSRHcmTlfMN4lCZK8ZW+4skdBZ9uGskKUzEv0bRal8AAAB0q6iPAbrVxyTFAuLbF2K1y44iE8qtKmeY6yNjRAD/EFkr2ZWBI707ZKuxjPFTCJmSAAAAAkrUk1X1sw7/BjigCedRO8dTDXmv1DdxwaWbWl40s9mnYElltpPtEqZVaDXHeUlWjBxxhh2k2W1CgtpgUa9p6i+E+UIfo18TC1H0Mqte7LBFzoX5CZQy3JKMgAxhIj/8LN7sn9ZPqz14J8PwvzpSIqcAAAACXGsr6joptd4ob7//qb0cYdZm0A5gHgrI39vc6JFHcSA7Uy/EVMrgKXfMxyS7oVD0OyJ8XOdhrrRH7VUURfcYNQ==',
            verificationMethod:
              'did:ion:test:EiDbXMB466nnPII3DRrKm4KvTL_UQ4I-PJzQfQ1502CDWw#lawwhjrzChbmjfRpwiGLU71LJ6ujT9jzZEBddCPEhGc',
          },
        },
      ],
    }))
    .otherwise(() => undefined)
