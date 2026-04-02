<script lang="ts">
	let {
		defaultValue = 'off',
		id = '',

	}: {
		defaultValue?: 'off' | 'pk' | 'hs' | 'ls';
		id?: string;
	} = $props();

	const modes = ['off', 'pk', 'hs', 'ls'] as const;
</script>

<div class="inline-grid grid-cols-2 gap-0.75 p-0.5 rounded-md bg-bg">
	{#each modes as mode}
		<label class="btn flex items-center justify-center w-8 h-8 rounded-sm text-xs font-black uppercase text-text bg-fg cursor-pointer select-none" for="{id}-{mode}">
			<input
				type="radio"
				class="sr-only"
				name="{id}"
				id="{id}-{mode}"
				value="{mode}"
				checked={defaultValue === mode}
			/>
			{mode}
		</label>
	{/each}
</div>

<style>
    @reference "../../routes/layout.css";
	.btn {
		box-shadow: 0px 5px 6px 0px rgba(0, 0, 0, 35%);
		@apply transition-colors duration-100;
        box-shadow:
            inset 0  2px 0 0 #9C9996,
            inset 0 -2px 0 0 rgba(0,0,0,0.5),
            0px 5px 6px 0px rgba(0, 0, 0, 35%);
    }

	.btn:has(input:checked) {
		box-shadow: inset 0px 0px 3.2px 2px rgba(0, 0, 0, 25%);
		@apply bg-checked;
	}
</style>
