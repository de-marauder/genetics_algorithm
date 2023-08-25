#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PATH_TO_CONFIG = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const updateConfig_1 = require("./utils/updateConfig");
const runAlgo_1 = require("./utils/runAlgo");
exports.DEFAULT_PATH_TO_CONFIG = path_1.default.resolve(os_1.default.homedir(), '.gen-algo', 'config', 'defaultConfig.yaml');
var defaultConfig = js_yaml_1.default.load(fs_1.default.readFileSync(exports.DEFAULT_PATH_TO_CONFIG, 'utf8'));
const DEFAULT_PATH_TO_OUTPUT = path_1.default.resolve(process.cwd(), 'output.txt');
// const usage = green(bold(`Usage: ${program.name()} [options] [command]`));
commander_1.program
    .name('gen-algo')
    // .usage(usage)
    .description('CLI to run genetics algorithm to optimize hydrogen production from a steam methane reformer')
    .version('0.0.1');
commander_1.program
    .command('update-config')
    .description(`Update current configuration`)
    .option('-p --path <string - path-to-file>', 'Path to configuration file')
    .action((opts, b) => {
    try {
        (0, updateConfig_1.updateConfig)(opts, defaultConfig);
    }
    catch (error) {
        console.log();
        console.log((0, chalk_1.bold)((0, chalk_1.red)('ERROR')));
        console.log();
        console.log((0, chalk_1.red)(error.message));
        console.log();
    }
});
commander_1.program
    .command('show-config')
    .description(`Show current configuration`)
    .action(() => {
    const config = fs_1.default.readFileSync(exports.DEFAULT_PATH_TO_CONFIG, 'utf8');
    console.log();
    console.log('======================================');
    console.log('| ', (0, chalk_1.bold)('Here\'s the current configuration'), ' |');
    console.log('======================================');
    console.log();
    console.log((0, chalk_1.yellow)(config));
});
commander_1.program
    .command('run')
    .description(`Run algorithm with config at ${exports.DEFAULT_PATH_TO_CONFIG}`)
    .action((opts) => {
    console.log('Algorithm running...');
    // console.log(opts);
    try {
        (0, runAlgo_1.runAlgo)(opts);
    }
    catch (error) {
        console.log();
        console.log((0, chalk_1.bold)((0, chalk_1.red)('ERROR')));
        console.log();
        console.log((0, chalk_1.red)(error.message));
        console.log();
        process.exit(0);
    }
})
    .option('-o, --outdir <path-to-output-file>', 'Absolute path to output file', DEFAULT_PATH_TO_OUTPUT)
    .option('--config, <path-to-config-yaml-file>', 'Absolute path to config file', exports.DEFAULT_PATH_TO_CONFIG);
// const opts = program.opts<ValidRunOptions>();
commander_1.program.parse();
