import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		// https://svelte.dev/docs/kit/adapter-static
		adapter: adapter({
			fallback: "404.html",
		}),
		alias: {
			"msw/browser": "node_modules/msw/lib/browser/index.mjs",
		},
		paths: {
			base: process.argv.includes("dev") ? "" : process.env.BASE_PATH,
		},
	},
};

export default config;
