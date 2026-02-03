<svelte:options customElement="svelte-quota-token" />

<script>
  export let status = "upcoming";
  export let timeLabel = "";
  export let points = 20;
  export let unit = "AP";

  const label = (value) => (typeof value === "string" ? value : String(value ?? ""));
</script>

<div class="token {label(status)}">
  {#if timeLabel}
    <div class="time">{timeLabel}</div>
    <div class="points {status === 'expired' ? 'expired' : ''}">
      +{points} {unit}
    </div>
  {:else}
    <div class="time">{`+${points} ${unit}`}</div>
  {/if}
</div>

<style>
  :host {
    display: inline-block;
  }

  .token {
    position: relative;
    height: 40px;
    width: 64px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.1;
    font-family: inherit;
    overflow: visible;
    margin: 0 4px;
  }

  .time {
    font-weight: 600;
    font-size: 14px;
    color: inherit;
  }

  .points {
    font-size: 10px;
    opacity: 0.8;
    margin-top: -2px;
  }

  .points.expired {
    text-decoration: line-through;
  }

  .completed {
    background: #8acc9f;
    color: #ffffff;
    border-color: #10b981;
  }

  .open {
    background: #ecfdf5;
    color: #047857;
    border-color: #6ee7b7;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.12);
    transform: scale(1.2);
    transition: transform 0.2s ease;
    transform-origin: center;
    margin: 0 10px;
  }

  .open::before,
  .open::after,
  .open::backdrop {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.35);
    background: radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));
    opacity: 0;
    animation: pulse 1.35s ease-out infinite;
    pointer-events: none;
  }

  .open::after {
    animation-delay: 0.45s;
  }

  .open::backdrop {
    animation-delay: 0.9s;
  }

  .expired {
    background: #fee2e2;
    color: #ef4444;
    border-color: #fca5a5;
  }

  .upcoming {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }

  @media (min-width: 640px) {
    .token {
      height: 48px;
      width: 80px;
      border-radius: 10px;
    }

    .time {
      font-size: 15px;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.85);
      opacity: 0;
    }
    20% {
      opacity: 0.55;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
</style>
