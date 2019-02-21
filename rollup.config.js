const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/compile.js',
    format: 'umd',
    name: 'render'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};