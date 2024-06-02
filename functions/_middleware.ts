import { firefoxMiddleware } from './middlewares/firefox'
import { pathMiddleware } from './middlewares/path'
import { staticMiddleware } from './middlewares/static'

export const onRequest = [staticMiddleware, firefoxMiddleware, pathMiddleware]
