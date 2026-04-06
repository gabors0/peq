<script lang="ts">
    let {
      value = 0,
      min = -Infinity,
      max = Infinity,
      label = '',
      isOff = false,
      onchange
    }: {
      value?: number;
      min?: number;
      max?: number;
      label?: string;
      isOff?: boolean;
      onchange?: (v: number) => void;
    } = $props();

    let inputText = $state(String(value));
    let focused = $state(false);

    $effect(() => {
        if (!focused) {
            inputText = String(value);
        }
    });

    function commit() {
        const parsed = parseFloat(inputText);
        if (!isNaN(parsed)) {
            const clamped = Math.min(max, Math.max(min, parsed));
            onchange?.(clamped);
            inputText = String(clamped);
        } else {
            inputText = String(value);
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
    }
</script>

<div class="p-1 w-19 rounded-sm bg-black">
    <input
        class="block w-full font-doto text-xl px-1 leading-6 outline-none {isOff ? 'bg-neutral-700 cursor-default' : 'bg-amber-500 text-stone-900'}"
        type="text"
        bind:value={inputText}
        disabled={isOff}
        onfocus={() => focused = true}
        onblur={() => { focused = false; commit(); }}
        onkeydown={handleKeydown}
    />
</div>
<span class="">{label}</span>
