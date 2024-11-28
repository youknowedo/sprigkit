import { t } from "../trpc.ts"
import { state } from "../mod.ts";

export const load = t.procedure.query(async () => {
    const code = await Deno.readTextFile(state.path);

    return {
        code
    };
});
