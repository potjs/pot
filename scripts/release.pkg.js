#!/usr/bin/env node
const fs = require('fs');
const path = require('path').posix;
const args = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const execa = require('execa');
const chalk = require('chalk');

const WORKSPACE_DIR = 'packages';
const {
  dry: isDryRun = false,
  // env,
  pkg: argPkg = '',
} = args;
console.log(args);

/**
 * @param rest
 * @returns {string}
 */
const pathResolve = (...rest) => path.resolve(__dirname, '..', ...rest);

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {object} opts
 * @returns {execa.ExecaChildProcess | *}
 */
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {object} opts
 */
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);

const runIfNotDry = isDryRun ? dryRun : run;

/**
 * @param {object} options
 * @param {*} argValue
 * @returns {Promise<*>}
 */
const getPrompts = async (options, argValue) => {
  if (argValue) {
    return argValue;
  }
  const { value } = await prompts(Object.assign(options, { name: 'value' }));
  return value;
};

/**
 * @param {string} pkg
 * @returns {Promise<void>}
 */
const release = async (pkg) => {
  const dir = `./${WORKSPACE_DIR}/${pkg}`;
  await runIfNotDry('pnpm', ['release', '--filter', dir]);
};

async function main() {
  const packages = fs.readdirSync(pathResolve(WORKSPACE_DIR));
  if (argPkg && !packages.includes(argPkg)) {
    throw new Error(`Package '${argPkg}' is not in [${packages.join(',')}]`);
  }

  const pkg = await getPrompts(
    {
      type: 'select',
      name: 'pkgName',
      message: 'Please select package',
      choices: fs
        .readdirSync(pathResolve(WORKSPACE_DIR))
        // .concat(['all'])
        .map((i) => {
          return { value: i, title: i };
        }),
    },
    argPkg,
  );

  if (pkg === 'all') {
    // TODO
  } else if (pkg) {
    await release(pkg);
  }
}

main().catch((err) => {
  console.error(err);
});
