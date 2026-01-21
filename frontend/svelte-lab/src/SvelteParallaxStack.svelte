<script>
  export let title = 'Capas activas'
  export let intensity = 18
  export let blurAmount = 0.6

  let rx = 0
  let ry = 0
  let px = 0
  let py = 0

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rx = y * intensity * -1
    ry = x * intensity
    px = x * 24
    py = y * 24
  }

  const reset = () => {
    rx = 0
    ry = 0
    px = 0
    py = 0
  }
</script>

<div
  class="stack"
  style={`--rx:${rx}deg; --ry:${ry}deg; --px:${px}px; --py:${py}px; --blur:${blurAmount}`}
  on:pointermove={handleMove}
  on:pointerleave={reset}
>
  <div class="bg"></div>
  <div class="layer layer-a"></div>
  <div class="layer layer-b"></div>
  <div class="layer layer-c"></div>
  <div class="label">{title}</div>
</div>

<style>
  .stack {
    position: relative;
    height: 160px;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(140deg, #ffffff, #ecfdf5);
    overflow: hidden;
    transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
    transition: transform 0.2s ease;
  }
  .bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%);
  }
  .layer {
    position: absolute;
    border-radius: 999px;
    filter: blur(calc(var(--blur) * 10px));
    opacity: 0.75;
  }
  .layer-a {
    width: 120px;
    height: 120px;
    background: rgba(16, 185, 129, 0.45);
    transform: translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));
    top: 20px;
    left: 14px;
  }
  .layer-b {
    width: 90px;
    height: 90px;
    background: rgba(52, 211, 153, 0.5);
    transform: translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));
    bottom: 18px;
    right: 20px;
  }
  .layer-c {
    width: 70px;
    height: 70px;
    background: rgba(14, 116, 144, 0.3);
    transform: translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));
    top: 30px;
    right: 70px;
  }
  .label {
    position: absolute;
    left: 16px;
    bottom: 14px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0f172a;
    background: rgba(255, 255, 255, 0.7);
    padding: 4px 8px;
    border-radius: 999px;
  }
</style>
