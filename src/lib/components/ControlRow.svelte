<script lang="ts">
	let {
		rowNo = 0,

	}: {
		rowNo: number;
	} = $props();
	
	import Slider from "$lib/components/Slider.svelte";
	import ModeBtns from "$lib/components/ModeBtns.svelte";
</script>

<div class="bg-fg rounded-sm p-4 gap-2 inline-flex items-center">
    <div class="font-bold text-fg bg-text px-2 self-stretch flex items-center rounded-sm">{rowNo}</div>
	<ModeBtns id={`mode-${rowNo}`} />
    <span class="border-l border-3 my-0.5 rounded-md self-stretch border-text"></span>
	<div class="flex flex-col gap-2">
		<Slider mode="gain" id={`slider-G-${rowNo}`} width={400} />
		<Slider mode="freq" id={`slider-F-${rowNo}`} width={400} />
	</div>
</div>