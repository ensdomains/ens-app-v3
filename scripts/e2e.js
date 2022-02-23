const { exec, spawn, spawnSync } = require("child_process");
const path = require("path");
const waitOn = require("wait-on");

const args = process.argv.slice(2);

const pipeOpts = {
  stdio: [process.stdin, process.stdout, process.stderr],
  shell: "/bin/bash",
};

const start = async () => {
  const ganache = spawn("yarn", ["node", "./ganache.mjs"], {
    ...pipeOpts,
    cwd: path.join(process.cwd(), "test-environment"),
  });

  await waitOn({
    resources: ["tcp:8545"],
  });

  args[0] === "ci" &&
    spawnSync("yarn", ["node", "./start.mjs", "ci"], {
      ...pipeOpts,
      cwd: path.join(process.cwd(), "test-environment"),
    });

  const docker =
    args[0] === "root"
      ? spawn("sudo", ["docker-compose", "up"], {
          ...pipeOpts,
          cwd: path.join(process.cwd(), "test-environment"),
        })
      : spawn("docker-compose", ["up"], {
          ...pipeOpts,
          cwd: path.join(process.cwd(), "test-environment"),
        });

  spawnSync("yarn", ["build:glocal"], pipeOpts);

  const server = spawn("yarn", ["start"], pipeOpts);

  await waitOn({
    resources: ["http://localhost:3000", "http://localhost:8040"],
  });
  const cypress =
    args[0] === "ci"
      ? spawn("yarn", ["cypress:ci"], pipeOpts)
      : spawn("yarn", ["cypress"], pipeOpts);

  process.on("SIGINT", () => {
    ganache.kill("SIGINT");
    docker.kill("SIGINT");
    server.kill("SIGINT");
    cypress.kill("SIGINT");
  });

  cypress.on("exit", () => {
    console.log("PIDS", ganache.pid, docker.pid, server.pid, cypress.pid);
    process.exit(0);
  });
};

start();
