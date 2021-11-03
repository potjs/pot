const chalk = require('chalk');

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `Use "pnpm install" for installation in this project.`,
    )}\n\n` +
      `    ${chalk.green(`If you don't have pnpm, install it via "npm i -g pnpm".`)}\n` +
      `    ${chalk.green(`For more details, go to https://pnpm.io/`)}\n`,
  );
  process.exit(1);
}
