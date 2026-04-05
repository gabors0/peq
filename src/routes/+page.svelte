<script lang="ts">
	import ControlRow from '$lib/components/ControlRow.svelte';
	import Slider from '$lib/components/Slider.svelte';
</script>

<div class="min-h-screen grid grid-cols-[3fr_1fr] gap-2 p-2 bg-bg font-jbmono text-text">
    <div class="bg-fg flex flex-col rounded-lg gap-2 p-2">
        <div class="p-1 flex h-full rounded-sm bg-black">
            <span class="flex flex-1 items-center justify-center font-doto text-xl px-1 leading-6 bg-neutral-800 text-stone-900">
                
            </span>
        </div>
        coming soon
    </div>
    <div class="bg-fg p-2 row-span-2 rounded-lg">B</div>
    <div class="bg-fg p-2 rounded-lg">
        <div class="flex flex-col">
            <Slider orientation="vertical"/>
        </div>
        <ControlRow rowNo={1} />
        <ControlRow rowNo={2} />
        <ControlRow rowNo={3} />
        <ControlRow rowNo={4} />
    </div>
</div>
