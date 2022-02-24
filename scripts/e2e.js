const concurrently = require("concurrently");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);

let type = "normal";
let envcmd = "yarn env:start";
let cycmd = "yarn cypress:wait";
let sudopref = "";

switch (args[0]) {
  case "root": {
    console.log("Running script in root mode");
    type = "root";
    envcmd = "yarn env:start:root";
    sudopref = "sudo ";
    break;
  }
  case "ci": {
    console.log("Running script in CI mode");
    type = "ci";
    envcmd = "yarn env:start:ci";
    cycmd = "yarn cypress:wait:ci";
    break;
  }
  default: {
    console.log("Running script in user mode");
  }
}

const { commands } = concurrently(
  [
    {
      command: "yarn buildandstart:glocal",
      name: "nextjs",
      prefixColor: "green.bold",
    },
    {
      command: envcmd,
      name: "env",
      prefixColor: "blue.bold",
      cwd: path.resolve(__dirname, "../test-environment"),
    },
    {
      command: cycmd,
      name: "cypress",
      prefixColor: "yellow.bold",
    },
  ],
  {
    prefix: "name",
  }
);

commands.forEach((cmd) => {
  if (cmd.index === 2) {
    cmd.close.subscribe(() => cleanup());
  }
  cmd.error.subscribe(() => cleanup(true));
});

let cleanupRunning = false;

function cleanup(error = false) {
  if (cleanupRunning) return;
  cleanupRunning = true;
  commands.forEach((cmd) => {
    let children = wrapTry(execSync, `pgrep -f "${cmd.command}"`);
    while (children) {
      const child = children
        .toString()
        .split("\n")
        .find((x) => parseInt(x));

      if (child) {
        const res = wrapTry(execSync, `pgrep -P ${child.trim()}`);
        wrapTry(execSync, `${sudopref}kill -9 ${child.trim()}`);
        if (res && !res.toString().includes("No such process")) {
          children = res;
        } else {
          children = null;
        }
      } else {
        children = null;
      }
    }
    wrapTry(execSync, `${sudopref}kill -2 ${cmd.pid}`);
  });
  execSync(`${sudopref}docker-compose down`, {
    cwd: path.resolve(__dirname, "../test-environment"),
  });
  process.exit(error ? 1 : 0);
}

function wrapTry(fn, ...args) {
  try {
    return fn(...args);
  } catch {
    return;
  }
}
