import express from "express";
import { handler } from "@repo/web/handler"
import { 
    createExpressMiddleware
} from "@trpc/server/adapters/express";
import { appRouter } from "./router.ts";
import { createContext } from "./trpc.ts";

export const initExpress = () => {
    const app = express()

    app.use(
        "/trpc",
        createExpressMiddleware({
            router: appRouter,
            createContext
        })
    )

    app.use(handler)

    app.listen(8000);
}
