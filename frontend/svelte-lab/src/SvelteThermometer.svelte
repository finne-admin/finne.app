<script>
  export let label = 'Temperatura'
  export let value = 22
  export let min = 0
  export let max = 40

  const clamp = (val, low, high) => Math.min(high, Math.max(low, val))
  $: safeValue = clamp(value, min, max)
  $: ratio = (safeValue - min) / (max - min || 1)
  $: percent = Math.round(ratio * 100)
  const lerp = (a, b, t) => Math.round(a + (b - a) * t)
  const toRgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`
  $: warm = { r: 239, g: 68, b: 68 }
  $: cool = { r: 34, g: 197, b: 94 }
  $: mix = {
    r: lerp(cool.r, warm.r, ratio),
    g: lerp(cool.g, warm.g, ratio),
    b: lerp(cool.b, warm.b, ratio),
  }
  $: fillColor = toRgb(mix.r, mix.g, mix.b)
  $: glowColor = `rgba(${mix.r}, ${mix.g}, ${mix.b}, 0.45)`
</script>

<div class="thermo" style={`--level:${percent}%; --fill:${fillColor}; --glow:${glowColor};`}>
  <div class="header">
    <div>
      <p class="title">{label}</p>
      <p class="subtitle">{safeValue}°C · {percent}%</p>
    </div>
    <div class="chip">{min}° – {max}°</div>
  </div>
  <div class="meter">
    <div class="tube">
      <div class="fill"></div>
      <div class="gloss"></div>
    </div>
    <div class="bulb"></div>
  </div>
</div>

<style>
  .thermo {
    display: grid;
    gap: 16px;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    padding: 16px;
    background: #ffffff;
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
    font-size: 12px;
    color: #64748b;
  }
  .chip {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  .meter {
    position: relative;
    height: 160px;
    display: grid;
    place-items: center;
  }
  .tube {
    position: relative;
    width: 24px;
    height: 140px;
    border-radius: 14px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    box-shadow: inset 0 6px 16px rgba(15, 23, 42, 0.08);
  }
  .fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--level);
    background: linear-gradient(180deg, #ffffff, var(--fill));
    transition: height 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .gloss {
    position: absolute;
    left: 3px;
    top: 8px;
    width: 6px;
    height: calc(100% - 16px);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.6);
    animation: shimmer 2.4s ease-in-out infinite;
  }
  .bulb {
    position: absolute;
    bottom: -6px;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, #ffffff, var(--fill));
    border: 2px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 10px 24px var(--glow);
    animation: pulse 2.2s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%, 100% {
      opacity: 0.35;
      transform: translateY(0);
    }
    50% {
      opacity: 0.7;
      transform: translateY(-8px);
    }
  }
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
</style>
