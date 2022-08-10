import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import workspacesRun from "workspaces-run";

// const isProduction = process.env.NODE_ENV === "production";

async function run() {
  const compiled = new Date().toUTCString().replace(/GMT/g, "UTC");

  const results = [];
  const packages = [];

  await workspacesRun({ cwd: __dirname, orderByDeps: true }, async pkg => {
    if (!pkg.config.private) {
      packages.push(pkg);
    }
  });

  packages.forEach(pkg => {
    const { version, source, main, module, types, dependencies, devDependencies } = pkg.config;

    const banner = [
      `/*!`,
      ` * ${pkg.name} - v${version}`,
      ` * Compiled ${compiled}`,
      ` *`,
      ` * ${pkg.name} is licensed under the Apache License Version 2.0.`,
      ` * https://opensource.org/licenses/Apache-2.0`,
      ` */`
    ].join("\n");

    const basePath = path.relative(__dirname, pkg.dir);
    const input = path.join(basePath, source);

    results.push({
      input,
      external: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
      output: [
        { banner, file: path.join(basePath, main), format: "cjs" },
        { banner, file: path.join(basePath, module), format: "esm" }
      ],
      plugins: [commonjs(), typescript()],
      watch: {
        exclude: "node_modules"
      }
    });

    results.push({
      input,
      output: [{ banner, file: path.join(basePath, types), format: "esm" }],
      plugins: [dts()]
    });
  });

  return results;
}

export default run();
