<script lang="ts">
	import { onMount } from 'svelte';
	import KnobCore from '$lib/vendor/knob.js/Knob.js';
	import { setupKnob } from '$lib/vendor/knob.js/ui.js';
	import Display from '$lib/components/Display.svelte';

	let {
		name = 'knob',
		value = $bindable(1),
		min = 0.1,
		max = 10,
		angleStart = 210,
		angleEnd = -30,
		indicatorAutoPosition = true,
		indicatorAutoRotate = true,
		indicatorRadius = 22,
		step = 0.01,
		label = '',
		disabled = false,
		class: className = '',
		...rest
	}: {
		name?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		angleStart?: number;
		angleEnd?: number;
		indicatorAutoPosition?: boolean;
		indicatorAutoRotate?: boolean;
		indicatorRadius?: number;
		label?: string;
		disabled?: boolean;
		class?: string;
		[key: string]: any;
	} = $props();

	let containerEl: HTMLDivElement;
	let inputEl: HTMLInputElement;
	let indicatorX = $state(0);
	let indicatorY = $state(0);
	let indicatorAngle = $state(0);
	let knob: any;

	onMount(() => {
		// Svelte sets value as a DOM property, not an HTML attribute.
		// The Knob constructor reads from getAttribute, so set it explicitly.
		inputEl.setAttribute('value', String(value));

		knob = new KnobCore(inputEl, (_knob: any, indicator: any) => {
			indicatorX = indicator.x;
			indicatorY = indicator.y;
			indicatorAngle = indicator.angle;
			value = parseFloat(_knob.val().toFixed(2));
		});

		setupKnob(knob, containerEl);
	});


</script>

<div class="flex flex-row items-center gap-x-1">
	<div class="ui-knob-container {className}" bind:this={containerEl}>
		<div class="ui-knob ui-knob-shadow"></div>
		<div class="ui-knob-indicator" style="transform: rotate({-indicatorAngle}deg);"></div>
		<input
			bind:this={inputEl}
			type="range"
			{name}
			{min}
			{max}
			{value}
			data-angle-start={angleStart}
			data-angle-end={angleEnd}
			data-indicator-auto-position={indicatorAutoPosition}
			data-indicator-auto-rotate={indicatorAutoRotate}
			data-indicator-radius={indicatorRadius}
			data-angle-scroll-ratio="0.012"
			data-angle-slide-ratio="0.5"
			hidden
			{...rest}
		/>
	</div>
	<Display {label} {value} {min} {max} isOff={disabled} onchange={(v) => knob?.val(v)} />
</div>

<style>
	@reference "../../routes/layout.css";
	.ui-knob-container {
		@apply relative h-20 w-20 select-none;
		zoom: 0.75;
	}

	.ui-knob {
		@apply absolute top-1/2 left-1/2 -mt-8 -ml-8 h-16 w-16 rounded-[50%] outline-3 outline-checked;
		background: linear-gradient(to bottom left, #ccc9c6 0%, #9c9996 100%);
		box-shadow: -4px 8px 6px rgba(0, 0, 0, 0.5);
	}

	.ui-knob-indicator {
		@apply absolute h-1.5 rounded-l-full bg-text;
		top: 50%;
		left: 50%;
		width: 34px;
		margin-top: -3px;
		transform-origin: 0% 50%;
	}
</style>
