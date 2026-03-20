"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const parser_1 = require("../../parser");
const testTags = [
    {
        tag: 'R!',
        color: '#000000',
        strikethrough: false,
        backgroundColor: '#ff3333'
    }
];
let originalGlobalTags;
let originalGlobalMultilineComments;
let originalGlobalHighlightPlainText;
function createMockEditor(text) {
    // The parser only needs document text, offsets, and decorations for these tests.
    const document = {
        getText: () => text,
        positionAt: (offset) => {
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
    };
}
function getMatchTag(parser, tagName) {
    const parserState = parser;
    const matchTag = parserState.tags.find(tag => tag.tag === tagName);
    if (!matchTag) {
        throw new Error(`Tag ${tagName} is not configured for tests.`);
    }
    return matchTag;
}
suite('Extension Test Suite', () => {
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration('highlighted-comments');
        const tagsInspection = config.inspect('tags');
        const multilineInspection = config.inspect('multilineComments');
        const plainTextInspection = config.inspect('highlightPlainText');
        originalGlobalTags = tagsInspection === null || tagsInspection === void 0 ? void 0 : tagsInspection.globalValue;
        originalGlobalMultilineComments = multilineInspection === null || multilineInspection === void 0 ? void 0 : multilineInspection.globalValue;
        originalGlobalHighlightPlainText = plainTextInspection === null || plainTextInspection === void 0 ? void 0 : plainTextInspection.globalValue;
        // Pin configuration so the tests do not depend on a developer's personal settings.
        yield config.update('tags', testTags, vscode.ConfigurationTarget.Global);
        yield config.update('multilineComments', true, vscode.ConfigurationTarget.Global);
        yield config.update('highlightPlainText', false, vscode.ConfigurationTarget.Global);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration('highlighted-comments');
        yield config.update('tags', originalGlobalTags, vscode.ConfigurationTarget.Global);
        yield config.update('multilineComments', originalGlobalMultilineComments, vscode.ConfigurationTarget.Global);
        yield config.update('highlightPlainText', originalGlobalHighlightPlainText, vscode.ConfigurationTarget.Global);
    }));
    test('single-line tags allow colon and skip shebangs', () => {
        const parser = new parser_1.Parser();
        parser.SetRegex('python');
        const editor = createMockEditor('#!/usr/bin/env python\n# R!: colon comment\n# R! plain comment');
        parser.FindSingleLineComments(editor);
        const matchTag = getMatchTag(parser, 'R!');
        assert.strictEqual(matchTag.ranges.length, 2);
        assert.strictEqual(matchTag.tagRanges.length, 2);
        parser.dispose();
    });
    test('single-line tags still match at end of line', () => {
        const parser = new parser_1.Parser();
        parser.SetRegex('javascript');
        const editor = createMockEditor('// R!');
        parser.FindSingleLineComments(editor);
        const matchTag = getMatchTag(parser, 'R!');
        assert.strictEqual(matchTag.ranges.length, 1);
        parser.dispose();
    });
    test('block comments allow colon after the tag', () => {
        const parser = new parser_1.Parser();
        parser.SetRegex('javascript');
        const editor = createMockEditor('/*\nR!: block detail\n*/');
        parser.FindBlockComments(editor);
        const matchTag = getMatchTag(parser, 'R!');
        assert.strictEqual(matchTag.ranges.length, 1);
        assert.strictEqual(matchTag.decorationTagRanges.length, 1);
        parser.dispose();
    });
    test('jsdoc comments allow colon after the tag and reject bare tags', () => {
        const parser = new parser_1.Parser();
        parser.SetRegex('typescript');
        const editor = createMockEditor('/**\n * R!: jsdoc detail\n * R!\n */');
        parser.FindJSDocComments(editor);
        const matchTag = getMatchTag(parser, 'R!');
        assert.strictEqual(matchTag.ranges.length, 1);
        assert.strictEqual(matchTag.tagRanges.length, 1);
        parser.dispose();
    });
});
//# sourceMappingURL=extension.test.js.map