import pkg from "./package.json";
import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
  {
    input: pkg.source,
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "esm" }
    ],
    plugins: [
      commonjs({
        defaultIsModuleExports: true
      }),
      typescript()
    ],
    watch: {
      exclude: "node_modules/**"
    }
  },
  {
    input: pkg.source,
    output: [{ file: pkg.types, format: "esm" }],
    plugins: [dts()]
  }
];
