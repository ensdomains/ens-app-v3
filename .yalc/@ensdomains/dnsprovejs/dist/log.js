"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const typescript_logging_1 = require("typescript-logging");
// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
typescript_logging_1.CategoryServiceFactory.setDefaultConfiguration(new typescript_logging_1.CategoryConfiguration(typescript_logging_1.LogLevel.Info));
// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
exports.logger = new typescript_logging_1.Category("dnsprovejs");
