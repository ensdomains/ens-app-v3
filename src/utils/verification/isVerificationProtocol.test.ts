import { isVerificationProtocol } from "./isVerificationProtocol";
import { describe, it, expect } from "vitest";

describe('isVerificationProtocol', () => {
  it.each(['dentity'])('should return true for protocol: %s', (protocol) => {
    expect(isVerificationProtocol(protocol)).toBeTruthy()
  })

  it.each(['dentitwo'])('should return false for invalid protocol: %s', (protocol) => {
    expect(isVerificationProtocol(protocol)).not.toBeTruthy()
  })
})
