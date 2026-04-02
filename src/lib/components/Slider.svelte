<script lang="ts">
	let {
		width = 200,
		mode = 'gain',
		orientation = 'horizontal',
		name = '',
		id = '',
		disabled = false
	}: {
		width?: number;
		mode?: 'gain' | 'freq' | 'q';
		orientation?: 'horizontal' | 'vertical'; //todo
		name?: string;
		id?: string;
		disabled?: boolean;
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

	let raw = $derived(mode === 'freq' ? toSlider(1000) : (config[mode].min + config[mode].max) / 2);
	let value = $derived(mode === 'freq' ? toFreq(raw) : raw);

	import Display from '$lib/components/Display.svelte';
</script>

<div class="flex flex-row items-center gap-x-1">
	<input
		bind:value={raw}
		{min}
		{max}
		{step}
		style="width: {width}px;"
		class="h-2 mr-2 rounded-full bg-bg outline-0"
		type="range"
		{name}
		{id}
	/>
	<Display {label} content={mode === 'gain' && value > 0 ? `+${value}` : String(value)} isOff={disabled} />
</div>

<style>
	@reference "../../routes/layout.css";
	input {
		-webkit-appearance: none;
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
		width: 25px;
		height: 25px;
		background: #04aa6d;
		cursor: pointer;
	}
</style>
