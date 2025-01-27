import { browser } from "$app/environment";
import { base } from "$app/paths";
import { handlers } from "./handlers";

export default async function enableMocking() {
	if (browser) {
		const { setupWorker } = await import("msw/browser");
		const worker = setupWorker(...handlers);

		return await worker.start({
			serviceWorker: {
				url: `${base}/mockServiceWorker.js`,
			},
		});
	}
}
