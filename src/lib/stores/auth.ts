import { writable, derived } from "svelte/store";

export const tokenStore = writable(localStorage.getItem("token") || null);
tokenStore.subscribe((value) => {
	if (value) {
		localStorage.setItem("token", value);
	} else {
		localStorage.removeItem("token");
	}
});
