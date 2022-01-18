import type { NextApiRequest, NextApiResponse } from 'next';
import type { IncomingMessage, ServerResponse } from 'http';

import { apiResolver } from 'next/dist/server/api-utils';

interface Props {
  query?: any;
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
}

export default function requestListener({ query = {}, handler }: Props) {
  return (req: IncomingMessage, res: ServerResponse) => {
    apiResolver(
      req,
      res,
      query,
      handler,
      {
        previewModeId: 'id',
        previewModeEncryptionKey: 'key',
        previewModeSigningKey: 'key',
      },
      false,
    );
  };
}
