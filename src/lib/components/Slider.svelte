<script lang="ts">
	let {
		width = 200,
		mode = "gain",
		orientation = "horizontal",
		name = '',
		id = '',
	}: {
		width?: number;
		mode?: "gain" | "freq" | "q";
		orientation?: "horizontal" | "vertical"; //todo
		name?: string;
		id?: string;
	} = $props();

	const config = {
		gain: { min: -12, max: 12, step: 0.1, label:"dB" },
		freq: { min: 0, max: 1, step: 0.001, label:"hz" },
		q:    { min: 0.1, max: 10, step: 0.1, label:"Q" },
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

	let raw = $state(mode === "freq" ? toSlider(1000) : (config[mode].min + config[mode].max) / 2);
	let value = $derived(mode === "freq" ? toFreq(raw) : raw);

	import Display from "$lib/components/Display.svelte";
</script>
<div class="flex flex-row gap-2 items-center">
<input bind:value={raw} {min} {max} {step} style="width: {width}px;" class="bg-bg h-2 outline-0 rounded-full" type="range" name="{name}" id="{id}" />
<Display label={label} content={mode === "gain" && value > 0 ? `+${value}` : String(value)} />
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
      @apply w-7.5 h-5 bg-green-500 cursor-pointer rounded-sm outline-2 outline-checked;
      background: linear-gradient(to right,
          #666563 15%,
          #CCC9C6 16%,
          #999794 45%,
          #1C1B1B 45%,
          #1C1B1B 55%,
          #6C6B69 55%,
          #666563 85%,
          #CCC9C6 86%
      );

    }
    
    input::-moz-range-thumb {
      width: 25px;
      height: 25px;
      background: #04AA6D;
      cursor: pointer;
    }
</style>