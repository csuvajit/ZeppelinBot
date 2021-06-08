"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templateFormatter_1 = require("./templateFormatter");
const ava_1 = __importDefault(require("ava"));
ava_1.default("Parses plain string templates correctly", t => {
    const result = templateFormatter_1.parseTemplate("foo bar baz");
    t.deepEqual(result, ["foo bar baz"]);
});
ava_1.default("Parses templates with variables correctly", t => {
    const result = templateFormatter_1.parseTemplate("foo {bar} baz");
    t.deepEqual(result, [
        "foo ",
        {
            identifier: "bar",
            args: [],
        },
        " baz",
    ]);
});
ava_1.default("Parses templates with function variables correctly", t => {
    const result = templateFormatter_1.parseTemplate('foo {bar("str", 5.07)} baz');
    t.deepEqual(result, [
        "foo ",
        {
            identifier: "bar",
            args: ["str", 5.07],
        },
        " baz",
    ]);
});
ava_1.default("Parses function variables with variable arguments correctly", t => {
    const result = templateFormatter_1.parseTemplate('foo {bar("str", 5.07, someVar)} baz');
    t.deepEqual(result, [
        "foo ",
        {
            identifier: "bar",
            args: [
                "str",
                5.07,
                {
                    identifier: "someVar",
                    args: [],
                },
            ],
        },
        " baz",
    ]);
});
ava_1.default("Parses function variables with function variable arguments correctly", t => {
    const result = templateFormatter_1.parseTemplate('foo {bar("str", 5.07, deeply(nested(8)))} baz');
    t.deepEqual(result, [
        "foo ",
        {
            identifier: "bar",
            args: [
                "str",
                5.07,
                {
                    identifier: "deeply",
                    args: [
                        {
                            identifier: "nested",
                            args: [8],
                        },
                    ],
                },
            ],
        },
        " baz",
    ]);
});
ava_1.default("Renders a parsed template correctly", async (t) => {
    const parseResult = templateFormatter_1.parseTemplate('foo {bar("str", 5.07, deeply(nested(8)))} baz');
    const values = {
        bar(strArg, numArg, varArg) {
            return `${strArg} ${numArg} !${varArg}!`;
        },
        deeply(varArg) {
            return `<${varArg}>`;
        },
        nested(numArg) {
            return `?${numArg}?`;
        },
    };
    const renderResult = await templateFormatter_1.renderParsedTemplate(parseResult, values);
    t.is(renderResult, "foo str 5.07 !<?8?>! baz");
});
ava_1.default("Supports base values in renderTemplate", async (t) => {
    const result = await templateFormatter_1.renderTemplate('{if("", "+", "-")} {if(1, "+", "-")}');
    t.is(result, "- +");
});
ava_1.default("Edge case #1", async (t) => {
    const result = await templateFormatter_1.renderTemplate("{foo} {bar()}");
    // No "Unclosed function" exception = success
    t.pass();
});
ava_1.default("Parses empty string args as empty strings", async (t) => {
    const result = templateFormatter_1.parseTemplate('{foo("")}');
    t.deepEqual(result, [
        {
            identifier: "foo",
            args: [""],
        },
    ]);
});
