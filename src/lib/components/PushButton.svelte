<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		onclick,
		size = 'md',
		children,
		...rest
	}: {
		onclick?: (e: MouseEvent) => void;
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const sizes = {
		sm: 'px-1.5 py-1 text-[10px]',
		md: 'px-2 py-1.5 text-xs',
		lg: 'px-3 py-2 text-sm',
	};
</script>

<button
	class="btn flex-1 {sizes[size]}"
	{onclick}
	{...rest}
>
	{@render children()}
</button>

<style>
	@reference "../../routes/layout.css";
	.btn {
		@apply flex items-center justify-center rounded-sm font-black uppercase text-text bg-fg cursor-pointer select-none transition-colors duration-75 leading-none;
		box-shadow:
			inset 0  2px 1px 0 #9C9996,
			inset 0 -2px 1px 0 rgba(0,0,0,0.5),
			0px 5px 6px 0px rgba(0, 0, 0, 35%);
	}

	.btn:active {
		box-shadow: inset 0px 0px 3.2px 2px rgba(0, 0, 0, 25%);
		@apply bg-checked;
	}
</style>
