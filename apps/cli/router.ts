import { t } from "./trpc.ts"
import { load } from "./procedures/load.ts";

export const appRouter = t.router({
    load
});
export type Router = typeof appRouter;

