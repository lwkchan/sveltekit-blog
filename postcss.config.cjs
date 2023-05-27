/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-preset-env')({
			stage: 1,
			features: {
				'custom-properties': {
					preserve: true
				}
			}
		}),
		require('cssnano')({
			autoprefixer: false
		})
	]
};
