<script>
  export let lift = 18
  export let sway = 6
  export let speed = 5.5
  export let color = '#10b981'
  export let rope = '#94a3b8'
</script>

<div
  class="balloon-card"
  style={`
    --lift:${lift}px;
    --sway:${sway}deg;
    --speed:${speed}s;
    --balloon:${color};
    --rope:${rope};
  `}
>
  <div class="scene">
    <div class="rope"></div>
    <div class="anchor"></div>
    <div class="balloon">
      <div class="string"></div>
    </div>
</div>
</div>

<style>
  .balloon-card {
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(180deg, #ffffff, #f8fafc);
    padding: 16px;
    height: 220px;
    display: grid;
    place-items: center;
  }
  .scene {
    position: relative;
    width: 160px;
    height: 180px;
  }
  .rope {
    position: absolute;
    left: 50%;
    bottom: 14px;
    width: 2px;
    height: 90px;
    background: var(--rope);
    transform-origin: bottom;
    transform: translateX(-50%);
    animation: rope-sway var(--speed) ease-in-out infinite;
  }
  .anchor {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #e2e8f0;
    border: 2px solid #cbd5f5;
    transform: translateX(-50%);
  }
  .balloon {
    position: absolute;
    left: 50%;
    bottom: 96px;
    width: 64px;
    height: 74px;
    border-radius: 50% 50% 46% 46%;
    background: radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));
    box-shadow: 0 16px 26px rgba(16, 185, 129, 0.2);
    transform-origin: bottom center;
    transform: translateX(-50%);
    animation: float var(--speed) ease-in-out infinite;
  }
  .string {
    position: absolute;
    left: 50%;
    bottom: -26px;
    width: 2px;
    height: 26px;
    background: var(--rope);
    transform: translateX(-50%);
  }
  @keyframes float {
    0%, 100% {
      transform: translateX(-50%) translateY(0) rotate(0deg);
    }
    50% {
      transform: translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway));
    }
  }
  @keyframes rope-sway {
    0%, 100% {
      transform: translateX(-50%) rotate(0deg);
    }
    50% {
      transform: translateX(-50%) rotate(calc(var(--sway) * -0.4));
    }
  }
</style>
