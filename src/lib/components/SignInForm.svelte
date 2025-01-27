<script lang="ts">
	import { goto } from "$app/navigation";
	import { tokenStore } from "$lib/stores/auth";
	import type { EventHandler } from "svelte/elements";

	let hints: Record<string, string> = {};
	let submitting = false;
	let flash: string | null = null;

	// BUG: this is called for every element with an error, so we don’t need to loop over the elements again
	const handleInvalid: EventHandler<Event, HTMLFormElement> = function (event) {
		hints = {};
		let focused = false;

		for (const input of event.currentTarget.querySelectorAll("input")) {
			if (input.validity.valid) continue;

			if (
				input.validity.valueMissing &&
				!["checkbox", "radio"].includes(input.type)
			) {
				// If a required field is empty, don’t show a message at all
			} else {
				// We could choose a custom validation message here:
				//   if (input.validity.typeMismatch && input.type === "email") {
				//     hints[name] = "Please enter a valid email"
				//   } else if ...

				// Or just use browser default:
				hints[input.name] = input.validationMessage;
			}

			// Focus the first field with an error:
			if (!focused) {
				input.focus();
				focused = true;
			}
		}
	};

	/**
	 * Remove validation message if event target became valid.
	 */
	const revalidate: EventHandler<Event, HTMLInputElement> = function ({
		currentTarget: input,
	}) {
		if (input.validity.valid) {
			delete hints[input.name];
			hints = hints;
		}
	};

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> =
		async function (event) {
			let resp;
			submitting = true;

			try {
				resp = await fetch("/api/auth", {
					method: "POST",
					body: new FormData(event.currentTarget),
				});
			} catch (e: any) {
				console.warn("Network error:", e);
				flash = "Error when logging in, please try again.";
				submitting = false;
				return;
			}

			if (resp.ok) {
				const { token } = await resp.json();
				tokenStore.set(token);
				goto("/dashboard");
			}

			[{ error: flash }] = [await resp.json()];
			submitting = false;
			event.currentTarget.querySelector("input")!.focus();
		};
</script>

{#if flash}
	<div class="flash">{flash}</div>
{/if}

<form
	class="form"
	action=""
	on:invalid|capture|preventDefault={handleInvalid}
	on:submit|preventDefault={handleSubmit}
>
	<label class="control is-block">
		<span class="control-label">E-mail</span>
		<input
			type="email"
			name="email"
			autocomplete="username"
			placeholder="john@example.net"
			required
			on:keyup={revalidate}
		/>
		{#if hints.email}
			<span class="control-hint">{hints.email}</span>
		{/if}
	</label>

	<label class="control is-block">
		<span class="control-label">Password</span>
		<input
			type="password"
			name="password"
			autocomplete="current-password"
			placeholder="••••••••••••"
			required
			on:keyup={revalidate}
		/>
		{#if hints.password}
			<span class="control-hint">{hints.password}</span>
		{/if}
	</label>

	<div class="control">
		<label class="checkbox">
			<input type="checkbox" name="pineapple" required on:change={revalidate} />
			Pineapple is delicious on pizza
		</label>
		{#if hints.pineapple}
			<span class="control-hint">{hints.pineapple}</span>
		{/if}
	</div>

	<div class="control">
		<button type="submit" disabled={submitting} class="is-primary">
			Sign in
			{#if submitting}🧐{/if}
		</button>
	</div>
</form>
