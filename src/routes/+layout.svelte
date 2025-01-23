<script>
	import enableMocking from "$lib/mocks";
	import "$lib/styles/index.css";

	const isReady = enableMocking();
</script>

{#await isReady then}
	<slot />
{/await}
