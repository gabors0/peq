<script lang="ts">
	import PushButton from '$lib/components/PushButton.svelte';
	import ControlRow from '$lib/components/ControlRow.svelte';

	type BandMode = 'off' | 'pk' | 'hs' | 'ls';
	type Band = { mode: BandMode; gain: number; freq: number; q: number };

	let bands = $state<Band[]>(
		Array.from({ length: 20 }, () => ({ mode: 'off' as BandMode, gain: 0, freq: 1000, q: 1.0 }))
	);

	let exportString = $state('');

	function updateExport() {
		let filterNo = 1;
		exportString = bands
			.filter((b) => b.mode !== 'off')
			.map(
				(b) =>
					`Filter ${filterNo++}: ON ${b.mode.toUpperCase()} Fc ${b.freq} Hz Gain ${b.gain.toFixed(1)} dB Q ${b.q.toFixed(2)}`
			)
			.join('\n');
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

<div
	class="fixed inset-0 grid grid-cols-[3fr_1fr] grid-rows-2 gap-1 bg-bg p-1 font-jbmono text-text"
>
	<div class="flex flex-col gap-2 rounded-lg bg-fg p-2">
		<div class="flex flex-row items-center gap-3">
			<hr class="w-full rounded-full border-3 border-text" />
			<b class="text-center text-nowrap">FREQUENCY GRAPH</b>
			<hr class="w-full rounded-full border-3 border-text" />
		</div>
		<div class="flex h-full rounded-sm bg-black p-2">
			<span
				class="flex flex-1 items-center justify-center bg-neutral-800 px-1 font-doto text-xl leading-6 text-stone-900"
			>
			</span>
		</div>
	</div>
	<div class="flex flex-col gap-2 rounded-lg bg-fg p-2">
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
	<div class="overflow-x-hidden overflow-y-auto rounded-lg bg-fg p-2">
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
	<div class="rounded-lg bg-fg p-2">D</div>
</div>
