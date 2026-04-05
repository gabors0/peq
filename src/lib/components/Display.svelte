<script lang="ts">
    let {
      content = "-.--",
      label = "",
      isOff = false
    }: {
      content?: string;
      label?: string;
      isOff?: boolean;
    } = $props();
</script>

<div class="p-1 w-19 rounded-sm bg-black">
    <span class="block w-full font-doto text-xl px-1 leading-6 {isOff ? 'bg-neutral-700' : 'bg-amber-500 text-stone-900'}">{isOff ? '\u00A0' : content}</span>
</div>
    <span class="">{label}</span>