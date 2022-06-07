"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalResolver__factory = exports.StaticMetadataService__factory = exports.ReverseRegistrar__factory = exports.PublicResolver__factory = exports.NameWrapper__factory = exports.ETHRegistrarController__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var ETHRegistrarController__factory_1 = require("./factories/ETHRegistrarController__factory");
Object.defineProperty(exports, "ETHRegistrarController__factory", { enumerable: true, get: function () { return ETHRegistrarController__factory_1.ETHRegistrarController__factory; } });
var NameWrapper__factory_1 = require("./factories/NameWrapper__factory");
Object.defineProperty(exports, "NameWrapper__factory", { enumerable: true, get: function () { return NameWrapper__factory_1.NameWrapper__factory; } });
var PublicResolver__factory_1 = require("./factories/PublicResolver__factory");
Object.defineProperty(exports, "PublicResolver__factory", { enumerable: true, get: function () { return PublicResolver__factory_1.PublicResolver__factory; } });
var ReverseRegistrar__factory_1 = require("./factories/ReverseRegistrar__factory");
Object.defineProperty(exports, "ReverseRegistrar__factory", { enumerable: true, get: function () { return ReverseRegistrar__factory_1.ReverseRegistrar__factory; } });
var StaticMetadataService__factory_1 = require("./factories/StaticMetadataService__factory");
Object.defineProperty(exports, "StaticMetadataService__factory", { enumerable: true, get: function () { return StaticMetadataService__factory_1.StaticMetadataService__factory; } });
var UniversalResolver__factory_1 = require("./factories/UniversalResolver__factory");
Object.defineProperty(exports, "UniversalResolver__factory", { enumerable: true, get: function () { return UniversalResolver__factory_1.UniversalResolver__factory; } });
