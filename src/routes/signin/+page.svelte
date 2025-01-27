<script>
	import SignInForm from "$lib/components/SignInForm.svelte";
	import { tokenStore } from "$lib/stores/auth";

	if ($tokenStore) {
		goto("/dashboard");
	}
</script>

<svelte:head>
	<title>Sign in – EveryCable Pro</title>
</svelte:head>

<div class="card">
	<SignInForm />
</div>
