<svelte:options customElement="svelte-milestones-tabs" />

<script>
  import { createEventDispatcher, onMount, tick } from 'svelte'

  export let tabs = []
  export let activeHref = ''

  const dispatch = createEventDispatcher()

  let buttonRefs = []
  let indicatorLeft = 0
  let indicatorWidth = 0
  let ready = false

  const isActive = href =>
    activeHref === href || (href !== '/milestones' && activeHref.startsWith(href))

  const handleNavigate = href => {
    dispatch('navigate', { href })
  }

  const updateIndicator = () => {
    const activeIndex = tabs.findIndex(tab => isActive(tab.href))
    const activeButton = buttonRefs[activeIndex]
    if (!activeButton) return

    indicatorLeft = activeButton.offsetLeft
    indicatorWidth = activeButton.offsetWidth
    ready = true
  }

  $: tabs, tick().then(updateIndicator)
  $: activeHref, tick().then(updateIndicator)

  onMount(() => {
    updateIndicator()

    const handleResize = () => updateIndicator()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
</script>

<nav class="tabs-shell" aria-label="Navegación de hitos">
  <div class="tabs-row" role="tablist">
    {#if ready}
      <span
        class="indicator"
        aria-hidden="true"
        style={`transform: translateX(${indicatorLeft}px); width: ${indicatorWidth}px;`}
      />
    {/if}

    {#each tabs as tab, index}
      <button
        bind:this={buttonRefs[index]}
        type="button"
        role="tab"
        class:active={isActive(tab.href)}
        aria-selected={isActive(tab.href)}
        on:click={() => handleNavigate(tab.href)}
      >
        <span>{tab.label}</span>
      </button>
    {/each}
  </div>
</nav>

<style>
  :host {
    display: block;
  }

  .tabs-shell {
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(203, 213, 225, 0.75);
  }

  .tabs-row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2.2rem;
    padding: 0 0 0.9rem;
  }

  button {
    position: relative;
    z-index: 1;
    appearance: none;
    border: 0;
    background: transparent;
    color: rgba(71, 85, 105, 0.92);
    cursor: pointer;
    font: inherit;
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1;
    padding: 0;
    transition:
      color 220ms ease,
      transform 220ms ease,
      opacity 220ms ease;
  }

  button:hover {
    color: #111827;
  }

  button.active {
    color: #111827;
  }

  button span {
    display: inline-block;
    transition:
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      letter-spacing 260ms ease;
  }

  button.active span {
    transform: translateY(-2px);
    letter-spacing: 0.01em;
  }

  .indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, #9fdbc2 0%, #67b48a 100%);
    box-shadow: 0 10px 20px -14px rgba(103, 180, 138, 0.6);
    transition:
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      width 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (max-width: 900px) {
    .tabs-row {
      gap: 1.35rem;
    }

    button {
      font-size: 0.94rem;
    }
  }

  @media (max-width: 640px) {
    .tabs-shell {
      margin-bottom: 1.5rem;
    }

    .tabs-row {
      gap: 0.85rem 1rem;
      justify-content: flex-start;
      padding-bottom: 0.8rem;
    }

    button {
      font-size: 0.92rem;
    }
  }
</style>
