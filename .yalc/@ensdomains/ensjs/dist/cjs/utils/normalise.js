"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalise = void 0;
const uts46bundle_js_1 = __importDefault(require("idna-uts46-hx/uts46bundle.js"));
const normalise = (name) => name ? uts46bundle_js_1.default.toUnicode(name, { useStd3ASCII: true }) : name;
exports.normalise = normalise;
