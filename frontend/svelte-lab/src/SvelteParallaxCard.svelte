<script>
  export let title = 'Pulso Focus'
  export let value = '78%'
  export let hint = 'Calma sostenida'
  export let intensity = 10

  let rx = 0
  let ry = 0
  let shine = 0

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rx = y * intensity * -1
    ry = x * intensity
    shine = (x + y + 1) * 25
  }

  const reset = () => {
    rx = 0
    ry = 0
    shine = 0
  }
</script>

<div
  class="card"
  style={`--rx:${rx}deg; --ry:${ry}deg; --shine:${shine}%`}
  on:pointermove={handleMove}
  on:pointerleave={reset}
>
  <div class="shine"></div>
  <div class="content">
    <p class="title">{title}</p>
    <p class="value">{value}</p>
    <p class="hint">{hint}</p>
  </div>
</div>

<style>
  .card {
    position: relative;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(160deg, #ffffff, #ecfdf5);
    padding: 18px;
    overflow: hidden;
    transform: perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));
    transition: transform 0.2s ease;
    box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
  }
  .shine {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);
    pointer-events: none;
  }
  .content {
    position: relative;
    display: grid;
    gap: 6px;
  }
  .title {
    margin: 0;
    font-size: 12px;
    color: #64748b;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .value {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
  }
  .hint {
    margin: 0;
    font-size: 12px;
    color: #475569;
  }
</style>
