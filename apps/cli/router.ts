import { t } from "./trpc.ts"
import { state } from "./mod.ts";

export const appRouter = t.router({
    load: t.procedure.query(async () => await Deno.readTextFile(state.path))
});
export type Router = typeof appRouter;

