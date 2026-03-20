import * as assert from 'assert';

import * as vscode from 'vscode';
import { Parser } from '../../parser';

const testTags = [
	{
		tag: 'R!',
		color: '#000000',
		strikethrough: false,
		backgroundColor: '#ff3333'
	}
];

let originalGlobalTags: unknown;
let originalGlobalMultilineComments: boolean | undefined;
let originalGlobalHighlightPlainText: boolean | undefined;

function createMockEditor(text: string): vscode.TextEditor
{
	// The parser only needs document text, offsets, and decorations for these tests.
	const document = {
		getText: () => text,
		positionAt: (offset: number) => {
			const clampedOffset = Math.max(0, Math.min(offset, text.length));
			const prefix = text.slice(0, clampedOffset);
			const lines = prefix.split(/\n/);
			return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
		}
	};

	return {
		document,
		setDecorations: () => undefined,
		selections: []
	} as unknown as vscode.TextEditor;
}

function getMatchTag(parser: Parser, tagName: string)
{
	const parserState = parser as unknown as { tags: Array<{ tag: string; ranges: unknown[]; tagRanges: unknown[]; decorationTagRanges: unknown[] }>; };
	const matchTag = parserState.tags.find(tag => tag.tag === tagName);

	if (!matchTag) {
		throw new Error(`Tag ${tagName} is not configured for tests.`);
	}

	return matchTag;
}

suite('Extension Test Suite', () =>
{
	suiteSetup(async () => {
		const config = vscode.workspace.getConfiguration('highlighted-comments');
		const tagsInspection = config.inspect('tags');
		const multilineInspection = config.inspect<boolean>('multilineComments');
		const plainTextInspection = config.inspect<boolean>('highlightPlainText');

		originalGlobalTags = tagsInspection?.globalValue;
		originalGlobalMultilineComments = multilineInspection?.globalValue;
		originalGlobalHighlightPlainText = plainTextInspection?.globalValue;

		// Pin configuration so the tests do not depend on a developer's personal settings.
		await config.update('tags', testTags, vscode.ConfigurationTarget.Global);
		await config.update('multilineComments', true, vscode.ConfigurationTarget.Global);
		await config.update('highlightPlainText', false, vscode.ConfigurationTarget.Global);
	});

	suiteTeardown(async () => {
		const config = vscode.workspace.getConfiguration('highlighted-comments');
		await config.update('tags', originalGlobalTags, vscode.ConfigurationTarget.Global);
		await config.update('multilineComments', originalGlobalMultilineComments, vscode.ConfigurationTarget.Global);
		await config.update('highlightPlainText', originalGlobalHighlightPlainText, vscode.ConfigurationTarget.Global);
	});

	test('single-line tags allow colon and skip shebangs', () => {
		const parser = new Parser();
		parser.SetRegex('python');

		const editor = createMockEditor('#!/usr/bin/env python\n# R!: colon comment\n# R! plain comment');
		parser.FindSingleLineComments(editor);

		const matchTag = getMatchTag(parser, 'R!');
		assert.strictEqual(matchTag.ranges.length, 2);
		assert.strictEqual(matchTag.tagRanges.length, 2);

		parser.dispose();
	});

	test('single-line tags still match at end of line', () => {
		const parser = new Parser();
		parser.SetRegex('javascript');

		const editor = createMockEditor('// R!');
		parser.FindSingleLineComments(editor);

		const matchTag = getMatchTag(parser, 'R!');
		assert.strictEqual(matchTag.ranges.length, 1);

		parser.dispose();
	});

	test('block comments allow colon after the tag', () => {
		const parser = new Parser();
		parser.SetRegex('javascript');

		const editor = createMockEditor('/*\nR!: block detail\n*/');
		parser.FindBlockComments(editor);

		const matchTag = getMatchTag(parser, 'R!');
		assert.strictEqual(matchTag.ranges.length, 1);
		assert.strictEqual(matchTag.decorationTagRanges.length, 1);

		parser.dispose();
	});

	test('jsdoc comments allow colon after the tag and reject bare tags', () => {
		const parser = new Parser();
		parser.SetRegex('typescript');

		const editor = createMockEditor('/**\n * R!: jsdoc detail\n * R!\n */');
		parser.FindJSDocComments(editor);

		const matchTag = getMatchTag(parser, 'R!');
		assert.strictEqual(matchTag.ranges.length, 1);
		assert.strictEqual(matchTag.tagRanges.length, 1);

		parser.dispose();
	});
});
