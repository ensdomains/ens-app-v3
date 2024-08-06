import { describe, it, expect } from "vitest";

import { GetVerifiedRecordsPropsReturnType } from "@app/hooks/verification/useVerifiedRecords/utils/createGetVerificationProps";

const transformer = (): GetVerifiedRecordsPropsReturnType => {
  return {
    isVerified: true,
    verifiers: ['dentity' as const]
  }
}

describe('transformProfileTextRecords', () => {

})