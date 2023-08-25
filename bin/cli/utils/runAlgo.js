"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAlgo = void 0;
const main_1 = require("../../Algorithm/main");
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function runAlgo(opts) {
    const config = js_yaml_1.default.load(fs_1.default.readFileSync(opts.config, 'utf8'));
    if (opts.outdir)
        config.outputFile = opts.outdir;
    (0, main_1.main)({
        populationResultsFile: config.outputFile,
        compositions: Object.assign({}, config.flareGasComposition),
        smrConfig: Object.assign({}, config.smrConfig),
        mbConfig: Object.assign({}, config.mbConfig),
        traitBoundaries: Object.assign({}, config.traitBoundaries),
        standardPressure: config.standardPressure
    });
}
exports.runAlgo = runAlgo;
