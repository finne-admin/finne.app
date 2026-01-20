<script>
  import { createEventDispatcher } from 'svelte'

  export let name = 'Ada'
  export let count = 2

  const dispatch = createEventDispatcher()

  const notify = () => {
    dispatch('ping', { from: 'svelte', count })
  }
</script>

<div class="card">
  <p class="label">Hola {name}</p>
  <p class="count">Count: {count}</p>
  <button type="button" on:click={notify}>Emitir evento</button>
</div>

<style>
  .card {
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    padding: 16px;
    display: grid;
    gap: 12px;
    font-family: "Figtree", system-ui, sans-serif;
    background: #ffffff;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  }
  .label {
    font-size: 14px;
    color: #0f172a;
    margin: 0;
  }
  .count {
    font-weight: 600;
    font-size: 20px;
    color: #0f172a;
    margin: 0;
  }
  button {
    border: 0;
    border-radius: 10px;
    padding: 10px 12px;
    background: #10b981;
    color: white;
    cursor: pointer;
    font-weight: 600;
  }
  button:hover {
    background: #059669;
  }
</style>
