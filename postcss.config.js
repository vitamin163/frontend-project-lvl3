// npm install postcss-loader autoprefixer css-mqpacker cssnano --save
const Autoprefixer = require('autoprefixer');
const CssMqpacker = require('css-mqpacker');
const CssNano = require('cssnano');

module.exports = {
  plugins: [
    new Autoprefixer(),
    new CssMqpacker(),
    new CssNano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
