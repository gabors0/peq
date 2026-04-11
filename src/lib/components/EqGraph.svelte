<script lang="ts">
	import type { Band } from '$lib/types';

	let {
		bands,
		preamp
	}: {
		bands: Band[];
		preamp: number;
	} = $props();

	// --- Coordinate mapping ---
	const W = 1000;
	const H = 400;
	const pad = { top: 20, right: 30, bottom: 25, left: 40 };
	const plotW = W - pad.left - pad.right;
	const plotH = H - pad.top - pad.bottom;

	const freqMin = 20;
	const freqMax = 20000;
	const logMin = Math.log(freqMin);
	const logMax = Math.log(freqMax);
	const dbMin = -12;
	const dbMax = 12;

	function toX(f: number): number {
		return pad.left + ((Math.log(f) - logMin) / (logMax - logMin)) * plotW;
	}
	function toY(db: number): number {
		return pad.top + ((dbMax - db) / (dbMax - dbMin)) * plotH;
	}

	// --- Frequency response per band ---
	function bandResponse(band: Band, f: number): number {
		if (band.mode === 'off' || band.gain === 0) return 0;
		const fc = band.freq;
		const G = band.gain;
		const Q = band.q;

		if (band.mode === 'pk') {
			const bw = 1 / Q;
			const ratio = f / fc - fc / f;
			return G * (bw * bw) / (ratio * ratio + bw * bw);
		}

		// Shelf slope factor from Q
		const n = Q * 0.5;

		if (band.mode === 'ls') {
			return G / (1 + Math.pow(fc / f, 2 * n));
		}

		// hs
		return G / (1 + Math.pow(f / fc, 2 * n));
	}

	// --- Sample points (logarithmically spaced) ---
	const numSamples = 200;
	const sampleFreqs: number[] = Array.from({ length: numSamples }, (_, i) => {
		const t = i / (numSamples - 1);
		return Math.exp(logMin + t * (logMax - logMin));
	});

	// --- Composite curve ---
	let pathD = $derived.by(() => {
		const points = sampleFreqs.map((f) => {
			let db = preamp;
			for (const band of bands) {
				db += bandResponse(band, f);
			}
			db = Math.max(dbMin, Math.min(dbMax, db));
			return `${toX(f)},${toY(db)}`;
		});
		return `M ${points.join(' L ')}`;
	});

	// --- Active band markers ---
	let markers = $derived(
		bands
			.filter((b) => b.mode !== 'off')
			.map((b) => ({
				x: toX(b.freq),
				y: toY(Math.max(dbMin, Math.min(dbMax, b.gain + preamp)))
			}))
	);

	// --- Grid ---
	const freqGridValues = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
	const freqGridLabels = ['20', '50', '100', '200', '500', '1k', '2k', '5k', '10k', '20k'];
	const dbGridValues = [-12, -6, 0, 6, 12];
</script>

<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" class="h-full w-full">
	<!-- Horizontal grid lines + dB labels -->
	{#each dbGridValues as db}
		<line
			x1={pad.left}
			y1={toY(db)}
			x2={W - pad.right}
			y2={toY(db)}
			stroke={db === 0 ? '#5a5856' : '#42403E'}
			stroke-width={db === 0 ? 1.5 : 0.75}
		/>
		<text
			x={pad.left - 6}
			y={toY(db)}
			text-anchor="end"
			dominant-baseline="middle"
			fill="#42403E"
			font-size="14"
			font-family="JetBrains Mono, monospace"
		>
			{db > 0 ? `+${db}` : db}
		</text>
	{/each}

	<!-- Vertical grid lines + freq labels -->
	{#each freqGridValues as f, i}
		<line
			x1={toX(f)}
			y1={pad.top}
			x2={toX(f)}
			y2={H - pad.bottom}
			stroke="#42403E"
			stroke-width="0.75"
		/>
		<text
			x={toX(f)}
			y={H - pad.bottom + 16}
			text-anchor="middle"
			fill="#42403E"
			font-size="12"
			font-family="JetBrains Mono, monospace"
		>
			{freqGridLabels[i]}
		</text>
	{/each}

	<!-- Composite EQ curve -->
	<path d={pathD} fill="none" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />

	<!-- Band markers -->
	{#each markers as m}
		<circle cx={m.x} cy={m.y} r="4" fill="#f59e0b" opacity="0.85" />
	{/each}
</svg>
