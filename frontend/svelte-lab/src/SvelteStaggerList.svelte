<script>
  import { createEventDispatcher, onMount } from 'svelte'

  export let label = 'Batch'
  export let count = 5
  export let cadence = 120

  const dispatch = createEventDispatcher()
  let items = []

  const buildItems = () => {
    items = Array.from({ length: count }, (_, i) => ({
      id: `${label}-${i}`,
      title: `${label} ${i + 1}`,
      score: Math.floor(Math.random() * 40) + 60,
    }))
    dispatch('refresh', { count })
  }

  const handleRefresh = () => {
    buildItems()
  }

  onMount(buildItems)
</script>

<div class="list">
  <div class="header">
    <div>
      <p class="title">Stagger list</p>
      <p class="subtitle">{count} items</p>
    </div>
    <button type="button" on:click={handleRefresh}>Actualizar</button>
  </div>
  <div class="items">
    {#each items as item, index (item.id)}
      <div class="item" style={`animation-delay:${index * cadence}ms`}>
        <span>{item.title}</span>
        <span class="score">{item.score}%</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .list {
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 16px;
    display: grid;
    gap: 16px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
  .subtitle {
    margin: 0;
    font-size: 11px;
    color: #94a3b8;
  }
  button {
    border: 1px solid #d1fae5;
    background: #ecfdf5;
    color: #065f46;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  .items {
    display: grid;
    gap: 10px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-radius: 12px;
    background: #f8fafc;
    color: #0f172a;
    font-size: 13px;
    animation: slide-in 0.5s ease forwards;
    opacity: 0;
    transform: translateY(6px);
  }
  .score {
    font-weight: 600;
  }
  @keyframes slide-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
