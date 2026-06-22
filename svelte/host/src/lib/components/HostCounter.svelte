<script lang="ts">
  import { onMount } from "svelte";

  let count = $state(0);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <button class="counter" onclick={() => count++}>Host counter: {count}</button>
{/if}

<style>
  .counter {
    background-color: rgb(246, 179, 82);
    border: 0 solid #e2e8f0;
    border-radius: 4px;
    color: rgb(24, 24, 24);
    cursor: pointer;
    font-weight: 700;
    margin-top: 24px;
    padding: 8px 16px;
  }
</style>
