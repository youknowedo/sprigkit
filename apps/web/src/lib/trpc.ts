import type { Router } from '@repo/cli';
import {
    createTRPCClient,
    httpBatchLink,
    loggerLink,
    splitLink,
    unstable_httpSubscriptionLink,
} from '@trpc/client';


let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export const trpc = () => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && browserClient) return browserClient;

    const client = createTRPCClient<Router>({
        links: [
            // adds pretty logs to your console in development and logs errors in production
            loggerLink(),
            splitLink({
                // uses the httpSubscriptionLink for subscriptions
                condition: (op) => op.type === 'subscription',
                true: unstable_httpSubscriptionLink({
                    url: `/trpc`,
                }),
                false: httpBatchLink({
                    url: `/trpc`,
                }),
            }),
        ],
    });


    if (isBrowser) browserClient = client;
    return client;
}

