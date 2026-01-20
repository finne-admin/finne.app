<script>
  export let title = 'Nivel 5'
  export let subtitle = 'Nivel 1/3'
  export let description = 'Alcanza nivel 5 de usuario.'
  export let progress = 4
  export let total = 5
  export let xp = 15
  export let status = 'En progreso'
  export let levelIndex = 1
  export let levelTotal = 3

  const clamp = (val, low, high) => Math.min(high, Math.max(low, val))
  $: safeTotal = Math.max(1, total)
  $: safeProgress = clamp(progress, 0, safeTotal)
  $: ratio = safeProgress / safeTotal
  $: percent = Math.round(ratio * 100)
  $: safeLevelTotal = Math.max(1, levelTotal)
  let activeLevel = clamp(levelIndex, 1, safeLevelTotal)
  let slideDir = 1
  $: if (levelIndex !== activeLevel) activeLevel = clamp(levelIndex, 1, safeLevelTotal)

  const setLevel = (delta) => {
    slideDir = delta >= 0 ? 1 : -1
    activeLevel = clamp(activeLevel + delta, 1, safeLevelTotal)
  }
</script>

<div class="wrapper">
  <button class="nav left" type="button" on:click={() => setLevel(-1)} aria-label="Nivel anterior">
    <span class="chevron"></span>
  </button>
  <div class="card">
    <div class="icon">
      <div class="ladder">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="content" style={`--dir:${slideDir}`}>
      {#key activeLevel}
        <div class="panel">
          <div class="row">
            <div class="title">
              <strong>{title}</strong>
              <span class="level-text">Nivel {activeLevel}/{safeLevelTotal}</span>
            </div>
            <div class="pill">{status}</div>
          </div>
          <p class="desc">{description}</p>
          <div class="row meta">
            <span>Progreso: {safeProgress} / {safeTotal}</span>
            <span class="xp">+{xp} XP</span>
          </div>
          <div class="progress">
            <div class="bar" style={`--fill:${percent}%`}></div>
            <div class="glow"></div>
          </div>
        </div>
      {/key}
    </div>
  </div>
  <button class="nav right" type="button" on:click={() => setLevel(1)} aria-label="Nivel siguiente">
    <span class="chevron"></span>
  </button>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: 28px 1fr 28px;
    align-items: stretch;
    gap: 12px;
  }
  .nav {
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 14px;
    display: grid;
    place-items: center;
    height: 100%;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .nav:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }
  .nav::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);
    transform: translateX(-120%);
    transition: transform 0.45s ease;
  }
  .nav:hover::after {
    transform: translateX(120%);
  }
  .chevron {
    width: 10px;
    height: 28px;
    border-right: 2px solid #475569;
    border-bottom: 2px solid #475569;
    transform: rotate(-45deg);
  }
  .nav.left .chevron {
    transform: rotate(135deg);
  }
  .card {
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.08);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.16);
  }
  .icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: #f8fafc;
    display: grid;
    place-items: center;
  }
  .ladder {
    width: 28px;
    height: 36px;
    border: 3px solid #7c5c4f;
    border-left-width: 5px;
    border-right-width: 5px;
    border-radius: 6px;
    position: relative;
  }
  .ladder span {
    position: absolute;
    left: 2px;
    right: 2px;
    height: 4px;
    background: #7c5c4f;
    border-radius: 999px;
    animation: rung 2.8s ease-in-out infinite;
  }
  .ladder span:nth-child(1) { top: 6px; animation-delay: 0s; }
  .ladder span:nth-child(2) { top: 14px; animation-delay: 0.2s; }
  .ladder span:nth-child(3) { top: 22px; animation-delay: 0.4s; }
  .ladder span:nth-child(4) { top: 30px; animation-delay: 0.6s; }
  .content {
    display: grid;
    gap: 8px;
  }
  .panel {
    animation: slide-in 0.4s ease;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .title {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .title strong {
    font-size: 18px;
    color: #0f172a;
  }
  .title span {
    font-size: 14px;
    color: #64748b;
  }
  .level-text {
    font-size: 14px;
    color: #64748b;
    animation: level-pop 0.35s ease;
  }
  .pill {
    padding: 6px 14px;
    background: #eef2ff;
    color: #1e3a8a;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  .desc {
    margin: 0;
    font-size: 14px;
    color: #0f172a;
  }
  .meta {
    font-size: 13px;
    color: #475569;
  }
  .xp {
    font-weight: 600;
    color: #047857;
  }
  .progress {
    position: relative;
    height: 12px;
    border-radius: 999px;
    background: #f1f5f9;
    overflow: hidden;
  }
  .bar {
    height: 100%;
    width: var(--fill);
    background: linear-gradient(90deg, #10b981, #34d399);
    transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));
    transform: translateX(-100%);
    animation: sweep 3.2s ease-in-out infinite;
  }
  @keyframes sweep {
    0%, 60% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  @keyframes level-pop {
    0% {
      opacity: 0;
      transform: translateY(4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes rung {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(calc(var(--dir) * 12px));
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
