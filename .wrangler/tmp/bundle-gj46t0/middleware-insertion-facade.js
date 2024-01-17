				import worker, * as OTHER_EXPORTS from "/Users/davidchu/projects/ens/ens-app-v3/.wrangler/tmp/pages-vkie7G/functionsWorker-0.4402835215731564.mjs";
				import * as __MIDDLEWARE_0__ from "/Users/davidchu/projects/ens/ens-app-v3/node_modules/.pnpm/wrangler@3.22.4/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
				const envWrappers = [__MIDDLEWARE_0__.wrap].filter(Boolean);
				const facade = {
					...worker,
					envWrappers,
					middleware: [
						__MIDDLEWARE_0__.default,
            ...(worker.middleware ? worker.middleware : []),
					].filter(Boolean)
				}
				export * from "/Users/davidchu/projects/ens/ens-app-v3/.wrangler/tmp/pages-vkie7G/functionsWorker-0.4402835215731564.mjs";

				const maskDurableObjectDefinition = (cls) =>
					class extends cls {
						constructor(state, env) {
							let wrappedEnv = env
							for (const wrapFn of envWrappers) {
								wrappedEnv = wrapFn(wrappedEnv)
							}
							super(state, wrappedEnv);
						}
					};
				

				export default facade;