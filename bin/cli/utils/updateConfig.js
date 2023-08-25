"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
const chalk_1 = require("chalk");
function updateConfig(opts, defaultConfig) {
    if (opts.path !== __1.DEFAULT_PATH_TO_CONFIG) {
        // check all new configurations for validity
        const newConfig = js_yaml_1.default.load(fs_1.default.readFileSync(opts.path, 'utf8'));
        console.log((0, chalk_1.dim)(JSON.stringify(newConfig)
            .split('{').join(' {\n\t')
            .split('}').join('\n}')
            .split('},').join('\n\t},\n\t')
            .split(',').join(', \n\t')
            .split('\n\n\t},').join('\n\t},')
            .split('},\n\n\t').join('},\n')
            .slice(0, -1) + '}'));
        // return
        const validConfig = checkConfig(newConfig, defaultConfig);
        // update the default
        defaultConfig = Object.assign(Object.assign({}, defaultConfig), validConfig);
        const yamlConfig = js_yaml_1.default.dump(defaultConfig);
        fs_1.default.writeFileSync(__1.DEFAULT_PATH_TO_CONFIG, yamlConfig, 'utf8');
        console.log();
        console.log((0, chalk_1.bold)((0, chalk_1.green)('Update successful!')));
        console.log();
        console.log('Updated Config');
        console.log();
        console.log((0, chalk_1.yellow)((0, chalk_1.italic)(yamlConfig)));
    }
    function checkConfig(config, defaultConfig) {
        const dconf = Object.assign({}, defaultConfig);
        const configCheck = (defaultParams, param, validOpts) => {
            for (let opt in param) {
                if (validOpts.includes(opt)) {
                    if (typeof param[opt] !== 'number')
                        throw new Error(`Invalid Configuration.\n${opt} should be a number. Received ${param[opt]}`);
                    if (param[opt] < 0)
                        throw new Error(`Invalid Configuration.\n${opt} should be greater than or equal to zero. Received ${param[opt]}`);
                    defaultParams[opt] = param[opt];
                }
                else {
                    throw new Error(`Invalid Configuration.\n${opt} is not a valid entry`);
                }
            }
        };
        if (config.smrConfig) {
            const validOpts = ['smrPopSize', 'smrGenSize', 'smrMovingAverage', 'smrMutationProbability'];
            const s = defaultConfig.smrConfig;
            configCheck(s, config.smrConfig, validOpts);
            dconf.smrConfig = s;
        }
        if (config.mbConfig) {
            const validOpts = ['mbPopSize', 'mbGenSize', 'mbMovingAverage', 'mbMutationProbability'];
            const m = defaultConfig.mbConfig;
            configCheck(m, config.mbConfig, validOpts);
            dconf.mbConfig = m;
        }
        // if (config.standardPressure) {
        //   // standardPressure: 1.01325
        // }
        if (config.flareGasComposition) {
            const validOpts = ['ch4', 'c2h6', 'c3h8', 'i-c4', 'n-c4', 'i-c5', 'n-c5', 'i-c6', 'n-c6', 'h2', 'n2', 'co2'];
            const composition = Object.assign({}, defaultConfig.flareGasComposition);
            configCheck(composition, config.flareGasComposition, validOpts);
            const sum = Object.values(composition).reduce((prev, curr) => prev + curr);
            if (sum !== 100)
                throw new Error(`Invalid Configuration.\nflareGasComposition total should be 100. Received ${sum}`);
            dconf.flareGasComposition = composition;
        }
        if (config.traitBoundaries) {
            const validOpts = ['pressureLowerbound', 'pressureUpperbound', 'temperatureLowerbound', 'temperatureUpperbound', 'steamCarbonRatioLowerbound', 'steamCarbonRatioUpperbound'];
            const traitBoundaries = Object.assign({}, defaultConfig.traitBoundaries);
            configCheck(traitBoundaries, config.traitBoundaries, validOpts);
            const sum = Object.values(traitBoundaries).reduce((prev, curr) => prev + curr);
            if (sum !== 100)
                throw new Error(`Invalid Configuration.\ntraitBoundaries total should be 100. Received ${sum}`);
            dconf.traitBoundaries = traitBoundaries;
        }
        if ('outputFile' in config) {
            if (typeof config.outputFile !== 'string')
                throw new Error(`Invalid configuration.\nOutputFile expects a string [name of output file]`);
            if (config.outputFile.length < 1)
                throw new Error(`Invalid configuration.\nOutputFile expects a string [name of output file]`);
            dconf.outputFile = config.outputFile;
        }
        return dconf;
    }
}
exports.updateConfig = updateConfig;
