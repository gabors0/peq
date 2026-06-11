<script lang="ts">
	let { value = $bindable('off') }: { value?: 'off' | 'pk' | 'hs' | 'ls' } =
		$props();

	const modes = ['off', 'pk', 'hs', 'ls'] as const;
</script>

<div class="inline-grid shrink-0 grid-cols-2 gap-0.75 rounded-md bg-bg p-0.5">
	{#each modes as mode}
		<button
			type="button"
			class:active={value === mode}
			class="btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm bg-fg text-xs leading-0 font-black text-text uppercase select-none"
			aria-pressed={value === mode}
			onmousedown={(event) => event.preventDefault()}
			onclick={() => (value = mode)}
		>
			{mode}
		</button>
	{/each}
</div>

<style>
	@reference '../../routes/layout.css';
	.btn {
		@apply transition-colors duration-100;
		box-shadow:
			inset 0 2px 1px 0 #9c9996,
			inset 0 -2px 1px 0 rgba(0, 0, 0, 0.5),
			0px 5px 6px 0px rgba(0, 0, 0, 35%);
	}

	.btn.active {
		@apply bg-checked;
		box-shadow: inset 0px 0px 3.2px 2px rgba(0, 0, 0, 25%);
	}
</style>
