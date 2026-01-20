<script>
  import { createEventDispatcher } from 'svelte'

  export let title = 'Focus Ring'
  export let subtitle = 'Anillo orbital'
  export let intensity = 0.6
  export let flow = 78

  const dispatch = createEventDispatcher()

  const handleHover = () => {
    dispatch('hover', { title })
  }
</script>

<div
  class="card"
  style={`--orbit-alpha:${intensity}`}
  role="button"
  tabindex="0"
  on:mouseenter={handleHover}
  on:focus={handleHover}
  on:keydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') handleHover()
  }}
>
  <div class="glow"></div>
  <div class="content">
    <p class="title">{title}</p>
    <p class="subtitle">{subtitle}</p>
    <div class="metrics">
      <span>Flow</span>
      <span>{flow}%</span>
    </div>
  </div>
  <div class="satellite-orbit">
    <div class="satellite"></div>
  </div>
  <div class="orbit"></div>
</div>

<style>
  .card {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid #d1fae5;
    background: linear-gradient(145deg, #ffffff, #ecfdf5);
    padding: 20px;
    min-height: 140px;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  }
  .glow {
    position: absolute;
    inset: -40%;
    background: radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);
    opacity: 0.7;
    filter: blur(8px);
  }
  .content {
    position: relative;
    display: grid;
    gap: 8px;
    color: #0f172a;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
  .subtitle {
    font-size: 12px;
    margin: 0;
    color: #64748b;
  }
  .metrics {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #0f172a;
  }
  .orbit {
    position: absolute;
    inset: -30%;
    border-radius: 999px;
    border: 1px dashed rgba(16, 185, 129, 0.3);
    animation: orbit 6s linear infinite;
    opacity: var(--orbit-alpha);
  }
  .satellite-orbit {
    position: absolute;
    inset: -30%;
    border-radius: 999px;
    animation: orbit 6s linear infinite;
  }
  .satellite {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #34d399;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(-78px);
  }
  @keyframes orbit {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
