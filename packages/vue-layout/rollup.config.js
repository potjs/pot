import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import baseConfig from '../../scripts/rollup.base';

const plugins = [
  postcss({
    plugins: [autoprefixer({ overrideBrowserslist: ['> 0.15% in CN'] })],
    extensions: ['.less', '.css'],
    use: ['less'],
    modules: true,
    extract: 'styles/index.css',
  }),
];

export default baseConfig(...plugins);
