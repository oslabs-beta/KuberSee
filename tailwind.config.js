/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,html,ts,tsx}'],
	daisyui: {
		themes: ['light', 'dark', 'cupcake', 'emerald', 'night'],
	},

	plugins: [require('daisyui')],
};
