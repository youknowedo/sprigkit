import { load } from './procedures/load.ts';
import { Command } from "commander";
import { initExpress } from "./server.ts";

export const state: {
    path: string;
    command: "" | "run" 
} = {
    path: "",
    command: ""
}

export const program = new Command();

program
    .name("SprigKit CLI")
    .version("0.0.1")

program.command("run")
    .description("Run a transpiled Sprig app in your browser")
    .argument("<path>", "Path to the transpiled app")
    .action((path: string) => {
        console.log(`Running app at ${path}`);
        
        state.path = path;
        state.command = "run";

        initExpress();
    });

program.parse(Deno.args);

