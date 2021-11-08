// import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const external = [
  'vue',
  'vue-router',
  'lodash.clonedeep',
  'axios'
];

const presets = () => {
  const extensions = ['.ts', '.tsx'];

  return [
    typescript({
      noEmitOnError: true,
    }),
    nodeResolve({ extensions }),
    babel({
      extensions,
      presets: [['@babel/preset-env', { modules: false }]],
      plugins: ['@vue/babel-plugin-jsx'],
      babelHelpers: 'bundled',
    }),
  ]
}

export default (...plugins) => {
  const base = [
    // ESModule
    {
      input: 'src/index.ts',
      output: {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
      plugins: [...presets(), ...plugins],
      external,
    },

    // CommonJS
    {
      input: 'src/index.ts',
      output: {
        file: 'dist/index.common.js',
        format: 'cjs',
        strict: false,
        exports: 'named',
        sourcemap: true,
        // dir: 'dist',
        // preserveModules: true,
        // preserveModulesRoot: 'src',
      },
      plugins: [...presets(), ...plugins],
      external,
    },
  ];

  // // UMD
  // {
  //   ...config,
  //   output: {
  //     file: "dist/index.js",
  //     format: "umd",
  //     name: "PotLayout",
  //     exports: "named",
  //     globals: {
  //       vue: "Vue",
  //     },
  //     sourcemap: true,
  //   },
  // },
  //
  // // UMD mini
  // {
  //   ...config,
  //   plugins: [...config.plugins, terser()],
  //   output: {
  //     file: "dist/index.min.js",
  //     format: "umd",
  //     name: "PotLayout",
  //     exports: "named",
  //     globals: {
  //       vue: "Vue",
  //     },
  //     sourcemap: true,
  //   },
  // },

  return base;
};
