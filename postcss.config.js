// npm install postcss-loader autoprefixer css-mqpacker cssnano --save
const Autoprefixer = require('autoprefixer');
const CssMqpacker = require('css-mqpacker');
const CssNano = require('cssnano');

module.exports = {
	plugins: [
		new Autoprefixer(), //  проставляет префиксы стилям
		new CssMqpacker(), //  сжимает медиа запросы
		new CssNano({
			// максимально минифицирует исходные стили
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
