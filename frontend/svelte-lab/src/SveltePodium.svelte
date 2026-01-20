<script>
  export let first = 82
  export let second = 64
  export let third = 48
  export let baseDuration = 0.9
  export let delayStep = 0.15

  let playId = 0
  let order = ['second', 'first', 'third']
  const podiumMap = {
    first: { label: '1', className: 'first' },
    second: { label: '2', className: 'second' },
    third: { label: '3', className: 'third' },
  }

  const heightFor = (key) => (key === 'first' ? first : key === 'second' ? second : third)

  $: items = order.map((key, index) => ({
    key,
    label: podiumMap[key].label,
    className: podiumMap[key].className,
    height: heightFor(key),
    duration: baseDuration + index * delayStep * 2,
  }))

  const reset = () => {
    playId += 1
  }

  const cycle = () => {
    order = [order[1], order[2], order[0]]
    playId += 1
  }
</script>

<div class="podium" data-play={playId}>
  <div class="line"></div>
  <div class="controls">
    <button class="reset" type="button" on:click={reset}>Reiniciar</button>
    <button class="swap" type="button" on:click={cycle}>Intercalar</button>
  </div>
  {#key playId}
    <div class="stack">
      {#each items as item (item.key)}
        <div
          class={`bar ${item.className}`}
          style={`height:${item.height}%; --dur:${item.duration}s;`}
        >
          <span>{item.label}</span>
        </div>
      {/each}
    </div>
  {/key}
</div>

<style>
  .podium {
    position: relative;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(180deg, #ffffff, #f8fafc);
    padding: 24px 18px 16px;
    height: 220px;
    display: grid;
    align-items: end;
  }
  .line {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 24px;
    height: 2px;
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6));
  }
  .controls {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    gap: 8px;
  }
  .reset,
  .swap {
    border: 1px solid rgba(16, 185, 129, 0.3);
    background: #ecfdf5;
    color: #065f46;
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
  }
  .reset:hover,
  .swap:hover {
    background: #d1fae5;
  }
  .stack {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: end;
    gap: 14px;
    height: 100%;
    z-index: 1;
  }
  .bar {
    position: relative;
    border-radius: 14px 14px 6px 6px;
    background: #d1fae5;
    color: #065f46;
    display: grid;
    place-items: center;
    font-size: 14px;
    font-weight: 600;
    transform-origin: bottom;
    animation: rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;
    transform: scaleY(0);
  }
  .bar span {
    opacity: 0;
    animation: fade-in 0.5s ease forwards;
    animation-delay: calc(var(--dur) * 0.7);
  }
  .bar::after {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 10px;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);
    opacity: 0;
    animation: sweep 1.6s ease forwards;
    animation-delay: calc(var(--dur) * 0.4);
  }
  .bar.first {
    background: linear-gradient(180deg, #10b981, #34d399);
    color: #ffffff;
    box-shadow: 0 14px 24px rgba(16, 185, 129, 0.35);
  }
  .bar.second {
    background: linear-gradient(180deg, #34d399, #6ee7b7);
  }
  .bar.third {
    background: linear-gradient(180deg, #bbf7d0, #ecfdf5);
  }
  .podium[data-play] .bar {
    animation: rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      settle 0.35s ease-out forwards;
    animation-delay: 0s, calc(var(--dur) * 0.9);
  }
  .podium[data-play] .bar span {
    animation: fade-in 0.5s ease forwards;
    animation-delay: calc(var(--dur) * 0.7);
  }
  .podium[data-play] .bar::after {
    animation: sweep 1.6s ease forwards;
    animation-delay: calc(var(--dur) * 0.4);
  }
  @keyframes rise {
    to {
      transform: scaleY(1);
    }
  }
  @keyframes settle {
    0% {
      transform: scaleY(1.02);
    }
    100% {
      transform: scaleY(1);
    }
  }
  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }
  @keyframes sweep {
    0% {
      opacity: 0;
      transform: translateY(10%);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: translateY(-20%);
    }
  }
</style>
