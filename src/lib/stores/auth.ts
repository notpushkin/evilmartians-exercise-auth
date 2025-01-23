import { writable, derived } from "svelte/store";

export const token = writable(localStorage.getItem("token") || null);
token.subscribe((value) => {
	if (value) {
		localStorage.setItem("token", value);
	} else {
		localStorage.removeItem("token");
	}
});

export const currentUser = derived(token, (token) =>
	token
		? {
				username: token,
			}
		: null,
);
