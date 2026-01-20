<script>
  import { createEventDispatcher } from 'svelte'

  export let label = 'Live'
  export let tone = 'emerald'
  export let active = true

  const dispatch = createEventDispatcher()

  const toggle = () => {
    active = !active
    dispatch('toggle', { active })
  }
</script>

<button class={`badge ${tone} ${active ? 'active' : ''}`} type="button" on:click={toggle}>
  <span class="dot"></span>
  {label}
</button>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    background: #ecfdf5;
    color: #065f46;
  }
  .badge.emerald {
    border-color: rgba(16, 185, 129, 0.35);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 0 rgba(16, 185, 129, 0.6);
  }
  .active .dot {
    animation: pulse 1.8s ease-in-out infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
</style>
