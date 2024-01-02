# Gen Algo CLI

A nodeJs based CLI for running a genetic algorithm to optimize hydrogen production from a given flare gas using a Steam Methane Reformer

## Build Instructions
```bash
cd path/to/repo
npm run build
npm link
```
- The first npm command builds the CLI; compiling the typescript code down to javascript and also creates some directories and files to allow the CLI operate properly
- The second npm command make the package available at a global level (kinda like installing it globally). This allows you to run the command `gen-algo` to use the application

## How to Use
### Base command
Usage: gen-algo [options] [command]

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  update-config [options]  Update current configuration
  show-config              Show current configuration
  run [options]            Run algorithm with config at $HOME/.gen-algo/config/defaultConfig.yaml
  help [command]           display help for command

### Run command
Usage: gen-algo run [options]

Run algorithm with config at $HOME/.gen-algo/config/defaultConfig.yaml

Options:
  -o, --outdir <path-to-output-file>    Absolute path to output file (default: "$HOME/output.txt")
  --config, <path-to-config-yaml-file>  Absolute path to config file (default: "$HOME/.gen-algo/config/defaultConfig.yaml")
  -h, --help                            display help for command

### Update Config
Usage: gen-algo update-config [options]

Update current configuration

Options:
  -p --path <string - path-to-file>  Path to configuration file
  -h, --help                         display help for command

### Show Current Config
Usage: gen-algo show-config [options]

Show current configuration

Options:
  -h, --help  display help for command

## Debugging
Always remember to run the help commands for information on how to use the CLI
```bash
gen-algo [command] --help
```
or
```bash
gen-algo help
```

To update your configuration, you can copy the file at `$HOME/.gen-algo/config/defaultConfig.yaml` and make changes to it. Then supply the path of the changed file to the `update-config` command
```bash
cp $HOME/.gen-algo/config/defaultConfig.yaml path/to/copy/file/to
gen-algo update-config -p path/to/copied-and-updated/config-file
```

After running the algorithm, the results are written to an `output.txt` file in the current working directory