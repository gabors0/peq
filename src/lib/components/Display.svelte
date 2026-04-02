<script lang="ts">
    let {
      content = "-.--",
      label = "",
    }: {
      content?: string;
      label?: string;
    } = $props();
</script>

<div class="p-1 w-19 rounded-sm bg-black">
    <span class="block w-full bg-amber-600 text-stone-900 font-doto text-xl px-1 leading-6">{content}</span>
</div>
    <span class="">{label}</span>