<!-- @migration-task Error while migrating Svelte code: Expected token ; -->
<script lang="ts">
    import { trpc } from "$lib/trpc"
    import { webEngine, type WebEngineAPI } from "sprig/web";
    import { onMount } from "svelte";
    import "../app.css";

    let canvas: HTMLCanvasElement | null = $state(null);
    let game: ReturnType<typeof webEngine> | null = $state(null);
    let isRunning = $state(true);

    let code = $state(""); 
    let newCode: string | undefined = $state(undefined);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const runGame = () => {
        if (!canvas) return;

        game = webEngine(canvas);

        const api: WebEngineAPI & {
            setTimeout: (
                ...args: Parameters<typeof setTimeout>
            ) => ReturnType<typeof setTimeout>;
            setInterval: (
                ...args: Parameters<typeof setInterval>
            ) => ReturnType<typeof setInterval>;
        } = {
            ...game.api,
            setTimeout: (...args: Parameters<typeof setTimeout>) => {
                const timer = setTimeout(...args);
                timeouts.push(timer);
                return timer;
            },
            setInterval: (...args: Parameters<typeof setInterval>) => {
                const timer = setInterval(...args);
                intervals.push(timer);
                return timer;
            },
        };

        console.log({ code });

        const run = new Function(`
            const {
                map,
                bitmap,
                color,
                tune,
                setMap,
                addText,
                clearText,
                addSprite,
                getGrid,
                getTile,
                tilesWith,
                clearTile,
                setSolids,
                setPushables,
                setBackground,
                getFirst,
                getAll,
                width,
                height,
                setLegend,
                onInput,
                afterInput,
                playTune,
                getState,
                setTimeout,
                setInterval,
            } = arguments[0];
                
            ${code}
        `);
        run(api);
    };

    onMount(async () => {
        console.log(trpc)
        const app = await trpc().load.query();
        
        code = app.code;
           
        while (!canvas);

        runGame();
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    id="wrapper"
    class="relative flex flex-col items-center justify-center gap-4 w-screen h-screen overflow-hidden transition-colors bg-center bg-cover font-pcb bg-pcb-green/80 bg-pcb-overlay"
    onclick={(e) => {
        canvas?.focus();
    }}
>
    <div class="flex items-center justify-center">
        <img
            class="h-[7.5vh] my-[4vh] object-contain object-center"
            src={"/sprigkit.png"}
            alt=""
        />
    </div>
    <div
        id="canvas"
        class="{newCode && isRunning
            ? 'show'
            : ''} max-h-[60%] relative object-contain max-w-[80vh] w-[90%] aspect-[160/128] bg-black"
    >
        <canvas
            bind:this={canvas}
            width="160"
            height="128"
            style="image-rendering: pixelated;"
            class="w-full h-full !border-none !outline-none"
            tabindex="0"
></canvas>
    </div>
    <div class="flex items-center">
        <button
            class="sprig-button"
            onclick={() => {
                if (game) {
                    if (isRunning) {
                        game.cleanup();
                        timeouts.forEach(clearTimeout);
                        intervals.forEach(clearInterval);

                        if (newCode) {
                            code = newCode;
                        }
                    } else if (canvas) {
                        runGame();
                    }
                    isRunning = !isRunning;
                    newCode = undefined;
                }
            }}
        >
            {isRunning ? "Stop" : "Play"}
        </button>
    </div>
</div>

<style>
    :global(body) {
        @apply bg-black;
    }

    #wrapper:has(:global(*:focus)) {
        @apply bg-pcb-green;
    }

    #canvas.show::before {
        content: "New game code available!";
        @apply absolute left-0 right-0 -top-6 text-center text-white bg-pcb-copper h-6 flex items-center justify-center;
    }
</style>

