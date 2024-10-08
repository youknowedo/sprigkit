import {
    commands,
    ExtensionContext,
    OutputChannel,
    Position,
    window,
    workspace,
} from "vscode";
import { openBitmapWebview } from "./bitmapWebview";
import { openColorWebview } from "./colorWebview";
import { triggerUpdateDecorations } from "./decorations";
import { openGameWebview } from "./gameWebview";

export let activeEditor = window.activeTextEditor;
export let output: OutputChannel;

export function activate(context: ExtensionContext) {
    output = window.createOutputChannel("SprigKit");

    const openGameFromWorkspace = commands.registerCommand(
        "sprigkit.openFromWorkspace",
        (editor) => openGameWebview(context, editor)
    );
    const openGameFromFile = commands.registerTextEditorCommand(
        "sprigkit.openFromFile",
        (editor) => openGameWebview(context, editor)
    );

    const openColorPanel = commands.registerTextEditorCommand(
        "sprigkit.openColorWebview",
        (editor, edit, args) => {
            console.log({ args });
            return openColorWebview(
                context,
                editor,
                new Position(args.startLine, args.startChar),
                new Position(args.endLine, args.endChar),
                args.currentColor
            );
        }
    );

    const openBitmapPanel = commands.registerTextEditorCommand(
        "sprigkit.openBitmapWebview",
        (editor, edit, args) => {
            console.log({ args });
            return openBitmapWebview(
                context,
                editor,
                new Position(args.startLine, args.startChar),
                new Position(args.endLine, args.endChar),
                args.currentBitmap
            );
        }
    );

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions
    );

    workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(true);
            }
        },
        null,
        context.subscriptions
    );

    context.subscriptions.push(
        openGameFromWorkspace,
        openGameFromFile,
        openColorPanel,
        openBitmapPanel
    );
}

export function deactivate() {}
