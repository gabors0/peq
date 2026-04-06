<script lang="ts">
	import ControlRow from '$lib/components/ControlRow.svelte';
	import Slider from '$lib/components/Slider.svelte';
</script>

<div class="fixed inset-0 grid grid-cols-[3fr_1fr] grid-rows-2 gap-2 p-2 bg-bg font-jbmono text-text">
    <div class="bg-fg flex flex-col rounded-lg gap-2 p-2">
        <div class="p-1 flex h-full rounded-sm bg-black">
            <span class="flex flex-1 items-center justify-center font-doto text-xl px-1 leading-6 bg-neutral-800 text-stone-900">
                
            </span>
        </div>
        coming soon
    </div>
    <div class="bg-fg row-span-2 p-2 rounded-lg">B</div>
    <div class="bg-fg p-2 rounded-lg overflow-y-auto overflow-x-hidden">
        <ControlRow rowNo={1} />
        <ControlRow rowNo={2} />
        <ControlRow rowNo={3} />
        <ControlRow rowNo={4} />
        <ControlRow rowNo={5} />
        <ControlRow rowNo={6} />
        <ControlRow rowNo={7} />
        <ControlRow rowNo={8} />
        <ControlRow rowNo={9} />
        <ControlRow rowNo={10} />
    </div>
</div>
