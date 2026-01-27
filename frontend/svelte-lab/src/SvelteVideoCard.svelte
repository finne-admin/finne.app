<svelte:options customElement="svelte-video-card" />

<script>
  import { createEventDispatcher } from 'svelte'

  export let videoId = ''
  export let hashedId = ''
  export let title = ''
  export let description = ''
  export let duration = ''
  export let thumbnail = ''
  export let selected = false
  export let disabled = false
  export let badge = ''
  export let tags = []
  export let favorite = false
  export let categoryLeft = ''
  export let categoryRight = ''
  export let categoryLeftColor = '#94a3b8'
  export let categoryRightColor = '#94a3b8'

  const dispatch = createEventDispatcher()

  const handleSelect = () => {
    if (disabled) return
    dispatch('select', { id: videoId })
  }

  const handleFavorite = (event) => {
    event.stopPropagation()
    if (disabled) return
    dispatch('favorite', { hashedId })
  }

  const handleKeyDown = (event) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect()
    }
  }
</script>

<div
  class="card-shell"
  style={`--category-left: ${categoryLeftColor}; --category-right: ${categoryRightColor};`}
>
  <div
    class="card {selected ? 'is-selected' : ''} {disabled ? 'is-disabled' : ''}"
    role="button"
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
    on:click={handleSelect}
    on:keydown={handleKeyDown}
  >
  <div class="thumb">
    {#if thumbnail}
      <img src={thumbnail} alt={`Miniatura de ${title}`} loading="lazy" />
    {:else}
      <div class="thumb-placeholder">▶</div>
    {/if}
    <div class="thumb-overlay"></div>

    <div class="pill-row">
      <div class="pill">{duration}</div>
      {#if badge}
        <div class="pill badge">{badge}</div>
      {/if}
    </div>

    <button
      class="favorite {favorite ? 'active' : ''}"
      on:click={handleFavorite}
      aria-label={favorite ? 'Quitar de favoritos' : 'Anadir a favoritos'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"
        />
      </svg>
    </button>

    <div class="check">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z" />
      </svg>
    </div>

  </div>

  <div class="body">
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="cta {selected ? 'cta-selected' : ''}">
      {selected ? 'Seleccionado' : 'Seleccionar video'}
    </div>
  </div>

  </div>

  {#if categoryLeft}
    <div class="category-lift" aria-hidden="true">
      <span class="category-chip" style={`--chip-color: ${categoryLeftColor};`}>{categoryLeft}</span>
      {#if categoryRight}
        <span class="category-chip" style={`--chip-color: ${categoryRightColor};`}>
          {categoryRight}
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  :host {
    display: block;
    font-family: 'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif;
  }

  .card-shell {
    position: relative;
    padding-bottom: 18px;
  }

  .card {
    position: relative;
    z-index: 1;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid transparent;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent);
  }

  .card.is-selected {
    border-color: #10b981;
    transform: scale(0.99);
  }

  .card.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .thumb {
    position: relative;
    background: #f1f5f9;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb-placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 28px;
    color: #94a3b8;
  }

  .thumb-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .card:hover .thumb-overlay {
    opacity: 1;
  }

  .pill-row {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    gap: 6px;
  }

  .pill {
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.6);
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
  }

  .pill.badge {
    background: rgba(15, 23, 42, 0.75);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .favorite {
    position: absolute;
    top: 8px;
    right: 8px;
    border: none;
    background: rgba(15, 23, 42, 0.35);
    color: #ffffff;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
  }

  .favorite svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
  }

  .favorite.active {
    background: rgba(255, 255, 255, 0.9);
    color: #ef4444;
  }

  .favorite.active svg {
    fill: currentColor;
    stroke: none;
  }

  .favorite:hover {
    transform: scale(1.05);
  }

  .check {
    position: absolute;
    bottom: 8px;
    left: 8px;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    display: grid;
    place-items: center;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .check svg {
    width: 16px;
    height: 16px;
    fill: #ffffff;
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .card.is-selected .check {
    background: #10b981;
    border-color: #059669;
  }

  .card.is-selected .check svg {
    opacity: 1;
    transform: scale(1);
  }

  .body {
    padding: 16px;
    display: grid;
    gap: 8px;
  }

  .body h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }

  .body p {
    margin: 0;
    font-size: 13px;
    color: #64748b;
    min-height: 34px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cta {
    padding: 8px 10px;
    border-radius: 10px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .card:hover .cta {
    background: #e2e8f0;
  }

  .cta-selected {
    background: #d1fae5;
    color: #047857;
  }

  .category-lift {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: -12px;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 0;
    pointer-events: none;
    transform: translateY(14px);
    opacity: 0;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }

  .category-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: #ffffff;
    text-transform: uppercase;
    background: var(--chip-color);
    box-shadow:
      0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent);
  }

  .card-shell:hover .category-lift,
  .card-shell:focus-within .category-lift {
    opacity: 1;
    transform: translateY(0);
  }
</style>
