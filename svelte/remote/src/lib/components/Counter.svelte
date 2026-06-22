<script lang="ts">
  import { onMount } from "svelte";

  let count = $state(0);
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
  });
</script>

<div class="remote-ssr-card">
  <div class="title">Remote SSR component</div>
  <p class="description">Rendered by remote before client hydration.</p>
  {#if hydrated}
    <button class="counter" onclick={() => count++}>Remote counter: {count}</button>
  {/if}
  <span class="badge" class:hydrated>
    <span class="dot"></span>
    {hydrated ? "Hydrated" : "SSR"}
  </span>
</div>

<style>
  .remote-ssr-card {
    background: #1f2124;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: white;
    margin: 20px;
    padding: 20px;
    text-align: center;
    width: 250px;
  }

  .title {
    margin-top: 10px;
    font-size: 21px;
  }

  .description {
    margin: 10px 0 16px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.82);
  }

  .counter {
    background-color: rgb(246, 179, 82);
    border: 0 solid #e2e8f0;
    border-radius: 4px;
    color: rgb(24, 24, 24);
    cursor: pointer;
    display: block;
    font-weight: 700;
    margin: 0 auto 12px;
    padding: 8px 16px;
  }

  .badge {
    align-items: center;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    color: #aeb4bc;
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    gap: 7px;
    line-height: 1;
    padding: 7px 11px;
  }

  .badge.hydrated {
    background: linear-gradient(135deg, rgba(156, 224, 170, 0.2), rgba(246, 179, 82, 0.12));
    box-shadow: inset 0 0 0 1px rgba(156, 224, 170, 0.18);
    color: #9ce0aa;
  }

  .dot {
    background: #aeb4bc;
    border-radius: 50%;
    display: inline-block;
    height: 7px;
    width: 7px;
  }

  .hydrated .dot {
    background: #9ce0aa;
    box-shadow: 0 0 8px rgba(156, 224, 170, 0.75);
  }
</style>
