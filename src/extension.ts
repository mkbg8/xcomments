import * as vscode from 'vscode';
import { Parser } from './parser';

export function activate(context: vscode.ExtensionContext)
{
	let activeEditor: vscode.TextEditor | undefined;
	let parser: Parser = new Parser();
	let currentLanguageId: string | undefined;

	context.subscriptions.push(parser);

	let updateDecorations = function ()
	{
		if (!activeEditor) return;

		setParserLanguage(activeEditor);
		parser.ClearDecorations();

		if (!parser.supportedLanguage) {
			parser.ApplyDecorations(activeEditor);
			parser.UpdateCursorDecorations(activeEditor);
			return;
		}

		parser.FindSingleLineComments(activeEditor);
		parser.FindBlockComments(activeEditor);
		parser.FindJSDocComments(activeEditor);
		parser.ApplyDecorations(activeEditor);
		parser.UpdateCursorDecorations(activeEditor);
	};

	function setParserLanguage(editor: vscode.TextEditor): boolean
	{
		const languageChanged = currentLanguageId !== editor.document.languageId;
		currentLanguageId = editor.document.languageId;
		parser.SetRegex(currentLanguageId);
		return languageChanged;
	}

	function clearEditorDecorations(editor: vscode.TextEditor): void
	{
		parser.ClearDecorations();
		parser.ApplyDecorations(editor);
		parser.UpdateCursorDecorations(editor);
	}

	if (vscode.window.activeTextEditor)
	{
		activeEditor = vscode.window.activeTextEditor;

		setParserLanguage(activeEditor);
		clearEditorDecorations(activeEditor);

		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor( (editor) =>
	{
		activeEditor = editor;
		
		if (editor)
		{
			setParserLanguage(editor);
			clearEditorDecorations(editor);

			triggerUpdateDecorations();
		}
		else {
			currentLanguageId = undefined;
			parser.ClearDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidOpenTextDocument(document =>
	{
		if (activeEditor && document.uri.toString() === activeEditor.document.uri.toString()) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidCloseTextDocument(document =>
	{
		if (activeEditor && document.uri.toString() === activeEditor.document.uri.toString()) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument( event =>
	{
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.window.onDidChangeTextEditorSelection(event => {
		if (activeEditor && event.textEditor === activeEditor) {
			if (setParserLanguage(activeEditor)) {
				clearEditorDecorations(activeEditor);
			}
			parser.UpdateCursorDecorations(activeEditor);
		}
	}, null, context.subscriptions);

	var timeout: NodeJS.Timeout;

	function triggerUpdateDecorations()
	{
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(updateDecorations, 200);
	}
}

export function deactivate() { }