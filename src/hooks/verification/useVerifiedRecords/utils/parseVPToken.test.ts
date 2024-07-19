import { parseVPToken } from "./parseVPToken";
import { it, describe, expect } from "vitest";


const TOKEN = [
  {
    credentialSubject: {
      credentialIssuer: 'Twitter',
      username: 'twitter-name'
    }
  },
  {
    credentialSubject: {
      credentialIssuer: 'Discord',
      name: 'discord-name'
    }
  },
  {
    credentialSubject: {
      credentialIssuer: 'Invalid'
    }
  }
] as any

describe('parseVPToken', () => {
  it('should parse', () => {
    expect(parseVPToken(TOKEN)).toEqual({
      'com.x': 'twitter-name',
      'com.discord': 'discord-name'
    })
  })
})