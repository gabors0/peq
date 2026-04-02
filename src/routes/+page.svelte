<script lang="ts">
	import ControlRow from '$lib/components/ControlRow.svelte';
</script>

<div class="min-h-screen flex items-center justify-center overflow-x-auto bg-fg p-4 font-jbmono text-text">
	<div class="inline-flex min-w-max flex-col gap-2 rounded-sm bg-bg p-2">
		<ControlRow rowNo={1} />
		<ControlRow rowNo={2} />
		<ControlRow rowNo={3} />
	</div>
</div>
