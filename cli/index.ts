#! /usr/bin/env node


import yaml from 'js-yaml';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { bold, red, yellow} from 'chalk';
import { Config, UpdateConfigOptions, ValidRunOptions } from './types';
import { updateConfig } from './utils/updateConfig';
import { runAlgo } from './utils/runAlgo';

export const DEFAULT_PATH_TO_CONFIG = path.resolve(
  os.homedir(),
  '.gen-algo',
  'config',
  'defaultConfig.yaml'
);
var defaultConfig = yaml.load(fs.readFileSync(DEFAULT_PATH_TO_CONFIG, 'utf8')) as Config

const DEFAULT_PATH_TO_OUTPUT = path.resolve(process.cwd(), 'output.txt');

// const usage = green(bold(`Usage: ${program.name()} [options] [command]`));

program
  .name('gen-algo')
  // .usage(usage)
  .description(
    'CLI to run genetics algorithm to optimize hydrogen production from a steam methane reformer'
  )
  .version('0.0.1')


program
  .command('update-config')
  .description(`Update current configuration`)
  .option('-p --path <string - path-to-file>', 'Path to configuration file')
  .action((opts: UpdateConfigOptions, b) => {
    try {
      updateConfig(opts, defaultConfig)
    } catch (error) {
      console.log()
      console.log(bold(red('ERROR')))
      console.log()
      console.log(red((error as Error).message))
      console.log()
    }
  });

program
  .command('show-config')
  .description(`Show current configuration`)
  .action(() => {
    const config = fs.readFileSync(DEFAULT_PATH_TO_CONFIG, 'utf8')
    console.log();
    console.log('======================================');
    console.log('| ', bold('Here\'s the current configuration'), ' |');
    console.log('======================================');
    console.log();
    console.log(yellow(config));
  });

program
  .command('run')
  .description(`Run algorithm with config at ${DEFAULT_PATH_TO_CONFIG}`)
  .action((opts: ValidRunOptions) => {
    console.log('Algorithm running...');
    // console.log(opts);
    try {
      runAlgo(opts)
    } catch (error) {
      console.log()
      console.log(bold(red('ERROR')))
      console.log()
      console.log(red((error as Error).message))
      console.log()
      process.exit(0)

    }
  })
  .option(
    '-o, --outdir <path-to-output-file>',
    'Absolute path to output file',
    DEFAULT_PATH_TO_OUTPUT
  )
  .option(
    '--config, <path-to-config-yaml-file>',
    'Absolute path to config file',
    DEFAULT_PATH_TO_CONFIG
  );

// const opts = program.opts<ValidRunOptions>();

program.parse();


