<script lang="ts">
	import PushButton from '$lib/components/PushButton.svelte';
	import ControlRow from '$lib/components/ControlRow.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import EqGraph from '$lib/components/EqGraph.svelte';
	import type { BandMode, Band } from '$lib/types';

	let preamp = $state(0);

	let bands = $state<Band[]>(
		Array.from({ length: 20 }, () => ({ mode: 'off' as BandMode, gain: 0, freq: 1000, q: 1.0 }))
	);

	let exportString = $state('');

	function updateExport() {
		let filterNo = 1;
		const lines = bands
			.filter((b) => b.mode !== 'off')
			.map(
				(b) =>
					`Filter ${filterNo++}: ON ${b.mode.toUpperCase()} Fc ${b.freq} Hz Gain ${b.gain.toFixed(1)} dB Q ${b.q.toFixed(2)}`
			);

		if (preamp !== 0) {
			lines.unshift(`Preamp: ${preamp.toFixed(1)} dB`);
		}

		exportString = lines.join('\n');
	}

	function downloadFile() {
		if (!exportString) return;
		const blob = new Blob([exportString], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'eq_settings.txt';
		a.click();
		URL.revokeObjectURL(url);
	}

	let copied = $state(false);
	async function copyToClipboard() {
		if (!exportString) return;
		try {
			await navigator.clipboard.writeText(exportString);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<!-- mobile block message -->
<div
	class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg p-8 font-plex text-fg md:hidden"
>
	<b class="text-2xl">Screen too narrow</b>
	<p class="text-center text-lg">
	Sorry, mobile isn't supported (yet).
	</p>
</div>

<div
	class="hidden auto-rows-auto gap-1 bg-bg p-1 font-plex text-text md:grid md:grid-cols-2 xl:fixed xl:inset-0 xl:grid-cols-[3fr_1fr] xl:grid-rows-[50%_1fr_3.5rem] xl:overflow-hidden"
>
	<div
		class="order-1 col-span-2 flex min-h-75 flex-col gap-2 rounded-lg bg-fg p-2 xl:order-0 xl:col-span-1 xl:min-h-0"
	>
		<div class="flex flex-row items-center gap-3">
			<hr class="w-full rounded-full border-3 border-text" />
			<b class="text-center text-nowrap">FREQUENCY GRAPH</b>
			<hr class="w-full rounded-full border-3 border-text" />
		</div>
		<div class="flex min-h-0 flex-1 rounded-sm bg-black p-2">
			<EqGraph {bands} {preamp} />
		</div>
	</div>
	<div class="order-3 flex min-h-62.5 flex-col gap-2 rounded-lg bg-fg p-2 xl:order-0 xl:min-h-0">
		<div class="flex flex-row items-center gap-3">
			<hr class="w-full rounded-full border-3 border-text" />
			<b class="text-center text-nowrap">EXPORT TO FILE</b>
			<hr class="w-full rounded-full border-3 border-text" />
		</div>

		<div class="flex min-h-0 flex-1 rounded-sm bg-black p-1.5">
			<textarea
				readonly
				class="w-full flex-1 resize-none overflow-auto bg-amber-500 px-1 font-doto text-xl leading-6 text-stone-900 outline-none"
				>{exportString}</textarea
			>
		</div>
		<div class="grid grid-cols-2 gap-0.75 rounded-md bg-bg p-0.75">
			<PushButton size="lg" onclick={updateExport}>update</PushButton>
			<PushButton
				size="lg"
				onclick={() => {
					alert('coming soon');
				}}>import</PushButton
			>
			<PushButton size="lg" onclick={downloadFile}>download</PushButton>
			<PushButton size="lg" onclick={copyToClipboard}>{copied ? 'copied!' : 'copy'}</PushButton>
		</div>
	</div>
	<div
		class="order-2 col-span-2 flex max-h-125 gap-2 rounded-lg bg-fg p-2 xl:order-0 xl:col-span-1 xl:row-span-2 xl:max-h-none"
	>
		<div
			class="flex min-h-0 flex-col items-center gap-1 rounded-sm px-2 py-2 outline-3 outline-text"
		>
			<b class="text-xs text-text">PRE</b>
			<Slider mode="gain" orientation="vertical" id="preamp" bind:value={preamp} />
		</div>
		<div class="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
			{#each bands as band, i}
				<ControlRow
					rowNo={i + 1}
					bind:mode={band.mode}
					bind:gain={band.gain}
					bind:freq={band.freq}
					bind:q={band.q}
				/>
			{/each}
		</div>
	</div>
	<div class="order-4 rounded-lg bg-fg p-2 xl:order-0">
		<div class="flex flex-row items-center gap-3">
			<hr class="w-full rounded-full border-3 border-text" />
			<b class="text-center text-nowrap">UPLOAD AUDIO FILE</b>
			<hr class="w-full rounded-full border-3 border-text" />
		</div>
		<div class="flex h-full items-center justify-center">Coming soon (maybe)</div>
	</div>
	<div
		class="order-5 col-span-2 flex items-center justify-center gap-2 rounded-lg bg-fg p-2 xl:order-0 xl:col-span-1 [&_a]:hover:underline"
	>
		<span>made by <a href="https://gs0.me" target="_blank">gabors0</a></span>
		<span class="select-none">•</span>
		<a href="https://github.com/gabors0/peq" target="_blank">github</a>
		<span class="select-none">•</span>
		<a href="https://ko-fi.com/gabors0" target="_blank">ko-fi</a>
	</div>
</div>
