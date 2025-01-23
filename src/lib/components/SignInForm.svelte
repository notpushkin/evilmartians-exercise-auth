<script lang="ts">
	import type { EventHandler } from "svelte/elements";

	const inputs: Record<string, HTMLInputElement> = {};
	let hints: Record<keyof typeof inputs, string> = {};
	let submitting = false;
	let flash: string | null = null;

	const handleInvalid: EventHandler<Event, HTMLFormElement> = function () {
		hints = {};
		let focused = false;

		for (const [name, input] of Object.entries(inputs)) {
			if (input.validity.valid) continue;
			// debugger;

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
				hints[name] = input.validationMessage;
			}

			// Focus the first field with an error:
			if (!focused) {
				input.focus();
				focused = true;
			}
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
			alert(`Logged in as ${token}!`);
			// Persist token and redirect
			// (also could use cookies perhaps)
			return;
		}

		[{ error: flash }] = [await resp.json()];
		submitting = false;
		Object.values(inputs)[0].focus();
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
			bind:this={inputs.email}
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
			bind:this={inputs.password}
		/>
		{#if hints.password}
			<span class="control-hint">{hints.password}</span>
		{/if}
	</label>

	<div class="control">
		<label class="checkbox">
			<input
				type="checkbox"
				name="pineapple"
				required
				bind:this={inputs.pineapple}
			/>
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
