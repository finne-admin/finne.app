<script>
  export let label = 'Sesiones'
  export let value = 12
  export let tone = '#10b981'
</script>

<div class="counter" style={`--tone:${tone}`}>
  <p class="label">{label}</p>
  {#key value}
    <div class="value">{value}</div>
  {/key}
</div>

<style>
  .counter {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 16px;
    background: #ffffff;
    display: grid;
    gap: 10px;
    box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
  }
  .label {
    margin: 0;
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .value {
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    position: relative;
    animation: flip 0.5s ease;
  }
  .value::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 3px;
    border-radius: 999px;
    background: var(--tone);
    animation: sweep 0.6s ease;
  }
  @keyframes flip {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes sweep {
    from {
      transform: scaleX(0.2);
    }
    to {
      transform: scaleX(1);
    }
  }
</style>
