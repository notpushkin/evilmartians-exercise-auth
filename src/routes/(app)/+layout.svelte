<script lang="ts">
	import { goto } from "$app/navigation";
	import { tokenStore } from "$lib/stores/auth";

	if (!$tokenStore) {
		goto("/signin");
	}

	function logOut() {
		tokenStore.set(null);
		goto("/signin");
	}
</script>

{#if $tokenStore}
	<nav>
		<h1>EveryCable Pro</h1>
		<ul>
			<li>
				<button class="is-link" on:click={logOut}>Log out</button>
			</li>
		</ul>
	</nav>

	<slot />
{/if}
