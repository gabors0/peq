<script lang="ts">
	import type { Band } from '$lib/types';

	let {
		bands,
		preamp
	}: {
		bands: Band[];
		preamp: number;
	} = $props();

	// --- Coordinate mapping (driven by measured container size) ---
	let W = $state(1000);
	let H = $state(400);
	const pad = { top: 20, right: 30, bottom: 25, left: 40 };
	let plotW = $derived(W - pad.left - pad.right);
	let plotH = $derived(H - pad.top - pad.bottom);

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

	// --- Biquad frequency response (RBJ Audio EQ Cookbook) ---
	const SAMPLE_RATE = 48000;

	type Coeffs = { b0: number; b1: number; b2: number; a0: number; a1: number; a2: number };

	function biquadCoeffs(band: Band): Coeffs {
		const A = Math.pow(10, band.gain / 40);
		const w0 = (2 * Math.PI * band.freq) / SAMPLE_RATE;
		const sinW = Math.sin(w0);
		const cosW = Math.cos(w0);
		const alpha = sinW / (2 * band.q);

		if (band.mode === 'pk') {
			return {
				b0: 1 + alpha * A,
				b1: -2 * cosW,
				b2: 1 - alpha * A,
				a0: 1 + alpha / A,
				a1: -2 * cosW,
				a2: 1 - alpha / A
			};
		}

		const sqrtA = Math.sqrt(A);
		const twoSqrtAalpha = 2 * sqrtA * alpha;

		if (band.mode === 'ls') {
			return {
				b0: A * (A + 1 - (A - 1) * cosW + twoSqrtAalpha),
				b1: 2 * A * (A - 1 - (A + 1) * cosW),
				b2: A * (A + 1 - (A - 1) * cosW - twoSqrtAalpha),
				a0: A + 1 + (A - 1) * cosW + twoSqrtAalpha,
				a1: -2 * (A - 1 + (A + 1) * cosW),
				a2: A + 1 + (A - 1) * cosW - twoSqrtAalpha
			};
		}

		// hs
		return {
			b0: A * (A + 1 + (A - 1) * cosW + twoSqrtAalpha),
			b1: -2 * A * (A - 1 + (A + 1) * cosW),
			b2: A * (A + 1 + (A - 1) * cosW - twoSqrtAalpha),
			a0: A + 1 - (A - 1) * cosW + twoSqrtAalpha,
			a1: 2 * (A - 1 - (A + 1) * cosW),
			a2: A + 1 - (A - 1) * cosW - twoSqrtAalpha
		};
	}

	function biquadMagnitudeDb(c: Coeffs, freq: number): number {
		const w = (2 * Math.PI * freq) / SAMPLE_RATE;
		const cosW = Math.cos(w);
		const cos2W = Math.cos(2 * w);
		const sinW = Math.sin(w);
		const sin2W = Math.sin(2 * w);

		const numReal = c.b0 + c.b1 * cosW + c.b2 * cos2W;
		const numImag = c.b1 * sinW + c.b2 * sin2W;
		const denReal = c.a0 + c.a1 * cosW + c.a2 * cos2W;
		const denImag = c.a1 * sinW + c.a2 * sin2W;

		const num = numReal * numReal + numImag * numImag;
		const den = denReal * denReal + denImag * denImag;

		if (den === 0) return 0;
		return 10 * Math.log10(num / den);
	}

	function bandResponse(band: Band, f: number): number {
		if (band.mode === 'off' || band.gain === 0) return 0;
		return biquadMagnitudeDb(biquadCoeffs(band), f);
	}

	// --- Sample points (logarithmically spaced, denser around high-Q bands) ---
	const baseNumSamples = 240;

	function addLogSamples(freqs: number[], startLog: number, endLog: number, count: number) {
		for (let i = 0; i < count; i++) {
			const t = count === 1 ? 0.5 : i / (count - 1);
			freqs.push(Math.exp(startLog + t * (endLog - startLog)));
		}
	}

	let sampleFreqs = $derived.by(() => {
		const freqs: number[] = [];

		addLogSamples(freqs, logMin, logMax, baseNumSamples);

		for (const band of bands) {
			if (band.mode === 'off' || band.gain === 0 || !Number.isFinite(band.q) || band.q <= 0) {
				continue;
			}

			const centerFreq = Math.max(freqMin, Math.min(freqMax, band.freq));
			const centerLog = Math.log(centerFreq);
			const halfWindow = Math.min(logMax - logMin, Math.max(Math.log(2) * 0.15, 2 / band.q));
			const localSamples = Math.round(Math.max(32, Math.min(260, band.q * 14)));

			freqs.push(centerFreq);

			addLogSamples(
				freqs,
				Math.max(logMin, centerLog - halfWindow),
				Math.min(logMax, centerLog + halfWindow),
				localSamples
			);
		}

		return [...new Set(freqs)].sort((a, b) => a - b);
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

	let bandPaths = $derived(
		bands
			.map((band, index) => ({ band, index }))
			.filter(({ band }) => band.mode !== 'off' && band.gain !== 0)
			.map(({ band, index }) => {
				const points = sampleFreqs.map((f) => {
					const db = Math.max(dbMin, Math.min(dbMax, bandResponse(band, f)));
					return `${toX(f)},${toY(db)}`;
				});
				return { d: `M ${points.join(' L ')}`, index };
			})
	);

	// --- Active band markers ---
	let markers = $derived(
		bands
			.map((b, index) => ({ band: b, index }))
			.filter(({ band }) => band.mode !== 'off')
			.map(({ band: b, index }) => {
				let db = preamp;
				for (const band of bands) {
					db += bandResponse(band, b.freq);
				}
				db = Math.max(dbMin, Math.min(dbMax, db));
				return { x: toX(b.freq), y: toY(db), index };
			})
	);

	// --- Grid ---
	const freqGridAll: number[] = [];
	for (const decade of [10, 100, 1000, 10000]) {
		for (let m = 1; m <= 9; m++) {
			const f = decade * m;
			if (f >= 20 && f <= 20000) freqGridAll.push(f);
		}
	}
	const freqLabeled = new Map<number, string>([
		[20, '20'],
		[50, '50'],
		[100, '100'],
		[200, '200'],
		[500, '500'],
		[1000, '1k'],
		[2000, '2k'],
		[5000, '5k'],
		[10000, '10k'],
		[20000, '20k']
	]);
	const dbGridValues = [-12, -6, 0, 6, 12];
</script>

<div bind:clientWidth={W} bind:clientHeight={H} class="h-full w-full">
	<svg viewBox="0 0 {W} {H}" class="h-full w-full">
		<!-- Horizontal grid lines + dB labels -->
		{#each dbGridValues as db (db)}
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
		{#each freqGridAll as f (f)}
			<line
				x1={toX(f)}
				y1={pad.top}
				x2={toX(f)}
				y2={H - pad.bottom}
				stroke="#42403E"
				stroke-width="0.75"
			/>
			{#if freqLabeled.has(f)}
				<text
					x={toX(f)}
					y={H - pad.bottom + 16}
					text-anchor="middle"
					fill="#42403E"
					font-size="12"
					font-family="JetBrains Mono, monospace"
				>
					{freqLabeled.get(f)}
				</text>
			{/if}
		{/each}

		<!-- Per-band EQ curves -->
		{#each bandPaths as path (path.index)}
			<path d={path.d} fill="none" stroke="#3a3836" stroke-width="1.5" stroke-linejoin="round" />
		{/each}

		<!-- Composite EQ curve -->
		<path d={pathD} fill="none" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />

		<!-- Band markers -->
		{#each markers as m (m.index)}
			<circle cx={m.x} cy={m.y} r="4" fill="#f59e0b" opacity="0.85" />
		{/each}
	</svg>
</div>
