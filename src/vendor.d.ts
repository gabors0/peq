declare module '$lib/vendor/knob.js/Knob.js' {
	const Knob: any;
	export default Knob;
}

declare module '$lib/vendor/knob.js/ui.js' {
	export function setupKnob(knob: any, containerEl: HTMLElement): void;
}
