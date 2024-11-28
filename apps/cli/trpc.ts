import { initTRPC } from '@trpc/server';
import type {
     CreateExpressContextOptions
} from '@trpc/server/adapters/express';

export const t = initTRPC.create()

export const createContext = ({
    req,
    res,
}: CreateExpressContextOptions) => ({});
export type Context = Awaited<ReturnType<typeof createContext>>;

