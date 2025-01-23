import { browser } from "$app/environment";
import { handlers } from "./handlers";

export default async function enableMocking() {
	if (browser) {
		const { setupWorker } = await import("msw/browser");
		const worker = setupWorker(...handlers);

		return await worker.start();
	}
}
