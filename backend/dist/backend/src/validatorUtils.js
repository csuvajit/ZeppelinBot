"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAndValidateStrict = exports.validate = exports.StrictValidationError = exports.TRegex = exports.inputPatternToRegExp = exports.InvalidRegexError = void 0;
const t = __importStar(require("io-ts"));
const pipeable_1 = require("fp-ts/lib/pipeable");
const Either_1 = require("fp-ts/lib/Either");
const utils_1 = require("./utils");
const deep_diff_1 = __importDefault(require("deep-diff"));
const regexWithFlags = /^\/(.*?)\/([i]*)$/;
class InvalidRegexError extends Error {
}
exports.InvalidRegexError = InvalidRegexError;
/**
 * This function supports two input syntaxes for regexes: /<pattern>/<flags> and just <pattern>
 */
function inputPatternToRegExp(pattern) {
    const advancedSyntaxMatch = pattern.match(regexWithFlags);
    const [finalPattern, flags] = advancedSyntaxMatch ? [advancedSyntaxMatch[1], advancedSyntaxMatch[2]] : [pattern, ""];
    try {
        return new RegExp(finalPattern, flags);
    }
    catch (e) {
        throw new InvalidRegexError(e.message);
    }
}
exports.inputPatternToRegExp = inputPatternToRegExp;
exports.TRegex = new t.Type("TRegex", (s) => s instanceof RegExp, (from, to) => Either_1.either.chain(t.string.validate(from, to), s => {
    try {
        return t.success(inputPatternToRegExp(s));
    }
    catch (err) {
        if (err instanceof InvalidRegexError) {
            return t.failure(s, [], err.message);
        }
        throw err;
    }
}), s => `/${s.source}/${s.flags}`);
// From io-ts/lib/PathReporter
function stringify(v) {
    if (typeof v === "function") {
        return t.getFunctionName(v);
    }
    if (typeof v === "number" && !isFinite(v)) {
        if (isNaN(v)) {
            return "NaN";
        }
        return v > 0 ? "Infinity" : "-Infinity";
    }
    return JSON.stringify(v);
}
// From io-ts/lib/PathReporter
// tslint:disable
function getContextPath(context) {
    return context
        .map(function (_a) {
        var key = _a.key, type = _a.type;
        return key + ": " + type.name;
    })
        .join("/");
}
// tslint:enable
class StrictValidationError extends Error {
    constructor(errors) {
        errors = Array.from(new Set(errors));
        super(errors.join("\n"));
        this.errors = errors;
    }
    getErrors() {
        return this.errors;
    }
}
exports.StrictValidationError = StrictValidationError;
const report = Either_1.fold((errors) => {
    const errorStrings = errors.map(err => {
        const context = err.context.map(c => c.key).filter(k => k && !k.startsWith("{"));
        while (context.length > 0 && !isNaN(context[context.length - 1]))
            context.splice(-1);
        const value = stringify(err.value);
        return value === undefined
            ? `<${context.join("/")}> is required`
            : `Invalid value supplied to <${context.join("/")}>${err.message ? `: ${err.message}` : ""}`;
    });
    return new StrictValidationError(errorStrings);
}, utils_1.noop);
function validate(schema, value) {
    const validationResult = schema.decode(value);
    return (pipeable_1.pipe(validationResult, Either_1.fold(err => report(validationResult), result => null)) || null);
}
exports.validate = validate;
/**
 * Decodes and validates the given value against the given schema while also disallowing extra properties
 * See: https://github.com/gcanti/io-ts/issues/322
 */
function decodeAndValidateStrict(schema, value, debug = false) {
    const validationResult = t.exact(schema).decode(value);
    return pipeable_1.pipe(validationResult, Either_1.fold(err => report(validationResult), result => {
        // Make sure there are no extra properties
        if (debug)
            console.log("JSON.stringify() check:", JSON.stringify(value) === JSON.stringify(result)
                ? "they are the same, no excess"
                : "they are not the same, might have excess", result);
        if (JSON.stringify(value) !== JSON.stringify(result)) {
            const diff = deep_diff_1.default(result, value);
            const errors = diff.filter(d => d.kind === "N").map(d => `Unknown property <${d.path.join(".")}>`);
            if (errors.length)
                return new StrictValidationError(errors);
        }
        return result;
    }));
}
exports.decodeAndValidateStrict = decodeAndValidateStrict;
