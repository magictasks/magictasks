// dev.js
const { spawn } = require("child_process");
const fs = require("fs");

const viteLog = fs.createWriteStream("vite.log", { flags: "w" });

const run = (command, args, logStream = null, options = {}) => {
  const proc = spawn(command, args, {
    stdio: ["pipe", "pipe", "pipe"],
    shell: true,
    ...options,
  });

  if (logStream) {
    proc.stdout.pipe(logStream);
    proc.stderr.pipe(logStream);
  }

  // Also show output live in terminal
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
};

// Run Vite with log
run("npm", ["run", "containerDev"], viteLog);

// Run Firebase Emulators (no log redirection, just live output)
run("npm", ["run", "emulators"]);
