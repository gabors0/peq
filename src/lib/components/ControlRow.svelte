<script lang="ts">
	let {
		rowNo = 0,
		mode = $bindable<'off' | 'pk' | 'hs' | 'ls'>('off'),
		gain = $bindable(0),
		freq = $bindable(1000),
		q = $bindable(1.0),
	}: {
		rowNo: number;
		mode?: 'off' | 'pk' | 'hs' | 'ls';
		gain?: number;
		freq?: number;
		q?: number;
	} = $props();

	import Slider from "$lib/components/Slider.svelte";
	import ModeBtns from "$lib/components/ModeBtns.svelte";
	import Knob from "$lib/components/Knob.svelte";
</script>

<div class="bg-fg rounded-sm p-4 gap-2 flex items-center">
    <div class="font-bold text-fg bg-text px-2 self-stretch w-9 flex justify-center items-center rounded-sm">{rowNo}</div>
	<ModeBtns id={`mode-${rowNo}`} bind:value={mode} />
    <span class="border-l border-3 my-0.5 rounded-md self-stretch border-text"></span>
	<div class="flex flex-col gap-2 flex-1 min-w-0">
		<Slider mode="gain" id={`slider-G-${rowNo}`} disabled={mode === 'off'} bind:value={gain} />
		<Slider mode="freq" id={`slider-F-${rowNo}`} disabled={mode === 'off'} bind:value={freq} />
	</div>
	<Knob bind:value={q} label="Q" min={0.1} max={10} step={0.01} angleStart={210} angleEnd={-30} disabled={mode === 'off'} />
</div>