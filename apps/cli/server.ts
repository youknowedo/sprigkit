import express from "express";
import { handler } from "@repo/web/handler"
import { 
    createExpressMiddleware
} from "@trpc/server/adapters/express";
import { appRouter } from "./router.ts";
import { createContext } from "./trpc.ts";
import cors from "cors";

export const initExpress = () => {
    const app = express()

    app.use(cors())

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
