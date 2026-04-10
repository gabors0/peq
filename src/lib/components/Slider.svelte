<script lang="ts">
	let {
		width = 200,
		mode = 'gain',
		orientation = 'horizontal',
		name = '',
		id = '',
		disabled = false,
		value = $bindable(0),
	}: {
		width?: number;
		mode?: 'gain' | 'freq' | 'q';
		orientation?: 'horizontal' | 'vertical';
		name?: string;
		id?: string;
		disabled?: boolean;
		value?: number;
	} = $props();

	const config = {
		gain: { min: -12, max: 12, step: 0.1, label: 'dB' },
		freq: { min: 0, max: 1, step: 0.001, label: 'hz' },
		q: { min: 0.1, max: 10, step: 0.1, label: 'Q' }
	};
	const { min, max, step, label } = $derived(config[mode]);

	const freqMin = 20;
	const freqMax = 20000;
	const logMin = Math.log(freqMin);
	const logMax = Math.log(freqMax);
	function toFreq(t: number) {
		return Math.round(Math.exp(logMin + t * (logMax - logMin)));
	}
	function toSlider(f: number) {
		return (Math.log(f) - logMin) / (logMax - logMin);
	}

	let raw = $state(mode === 'freq' ? toSlider(1000) : (config[mode].min + config[mode].max) / 2);
	let displayValue = $derived(mode === 'freq' ? toFreq(raw) : raw);
	$effect(() => { value = displayValue; });

	const displayMin = mode === 'freq' ? 20 : config[mode].min;
	const displayMax = mode === 'freq' ? 20000 : config[mode].max;

	function handleDisplayChange(v: number) {
		raw = mode === 'freq' ? toSlider(v) : v;
	}

	import Display from '$lib/components/Display.svelte';
</script>

{#if orientation === 'vertical'}
<div class="slider-vertical flex flex-1 min-h-0 flex-col items-center gap-y-1">
	<input
		bind:value={raw}
		{min}
		{max}
		{step}
		class="vertical-range rounded-full bg-bg outline-0"
		type="range"
		{name}
		{id}
	/>
	<Display {label} value={displayValue} min={displayMin} max={displayMax} isOff={disabled} onchange={handleDisplayChange} />
</div>
{:else}
<div class="flex flex-row items-center gap-x-1">
	<input
		bind:value={raw}
		{min}
		{max}
		{step}
		class="h-2 mr-2 flex-1 min-w-0 rounded-full bg-bg outline-0"
		type="range"
		{name}
		{id}
	/>
	<Display {label} value={displayValue} min={displayMin} max={displayMax} isOff={disabled} onchange={handleDisplayChange} />
</div>
{/if}

<style>
	@reference "../../routes/layout.css";
	input {
		-webkit-appearance: none;
	}

	.vertical-range {
		writing-mode: vertical-lr;
		direction: rtl;
		width: 8px;
		flex: 1 1 0;
		min-height: 0;
	}

	input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 30%);
		@apply h-5 w-7.5 cursor-pointer rounded-sm bg-green-500 outline-2 outline-checked;
		background: linear-gradient(
			to right,
			#666563 15%,
			#ccc9c6 16%,
			#999794 45%,
			#1c1b1b 45%,
			#1c1b1b 55%,
			#6c6b69 55%,
			#666563 85%,
			#ccc9c6 86%
		);
	}
	input::-moz-range-thumb {
		width: 30px;
		height: 20px;
		border: none;
		border-radius: 2px;
		cursor: pointer;
		box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 30%);
		background: linear-gradient(
			to right,
			#666563 15%,
			#ccc9c6 16%,
			#999794 45%,
			#1c1b1b 45%,
			#1c1b1b 55%,
			#6c6b69 55%,
			#666563 85%,
			#ccc9c6 86%
		);
	}

	.vertical-range::-webkit-slider-thumb {
		@apply h-7.5 w-5;
		background: linear-gradient(
			to bottom,
			#666563 15%,
			#ccc9c6 16%,
			#999794 45%,
			#1c1b1b 45%,
			#1c1b1b 55%,
			#6c6b69 55%,
			#666563 85%,
			#ccc9c6 86%
		);
	}
	.vertical-range::-moz-range-thumb {
		width: 20px;
		height: 30px;
		background: linear-gradient(
			to bottom,
			#666563 15%,
			#ccc9c6 16%,
			#999794 45%,
			#1c1b1b 45%,
			#1c1b1b 55%,
			#6c6b69 55%,
			#666563 85%,
			#ccc9c6 86%
		);
	}
</style>
