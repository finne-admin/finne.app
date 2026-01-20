<script>
  import { createEventDispatcher } from 'svelte'

  export let label = 'Lanzar onda'
  export let tone = '#10b981'

  const dispatch = createEventDispatcher()
  let ripples = []

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Math.random().toString(36).slice(2)
    ripples = [...ripples, { id, x, y }]
    dispatch('ripple', { x, y })
  }

  const removeRipple = (id) => {
    ripples = ripples.filter((r) => r.id !== id)
  }
</script>

<button class="ripple" type="button" style={`--tone:${tone}`} on:click={handleClick}>
  {#each ripples as ripple (ripple.id)}
    <span
      class="wave"
      style={`left:${ripple.x}px; top:${ripple.y}px;`}
      on:animationend={() => removeRipple(ripple.id)}
    ></span>
  {/each}
  <span class="label">{label}</span>
</button>

<style>
  .ripple {
    position: relative;
    overflow: hidden;
    padding: 12px 20px;
    border-radius: 14px;
    border: none;
    background: var(--tone);
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 16px 28px rgba(16, 185, 129, 0.25);
  }
  .label {
    position: relative;
    z-index: 1;
  }
  .wave {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.45);
    transform: translate(-50%, -50%);
    animation: ripple 0.8s ease-out forwards;
  }
  @keyframes ripple {
    from {
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(8);
    }
  }
</style>
