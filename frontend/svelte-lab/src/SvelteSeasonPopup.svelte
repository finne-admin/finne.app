<svelte:options customElement="svelte-season-popup" />

<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let open = false;
  export let title = "Temporada finalizada";
  export let message =
    "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo.";
  export let cta = "Entendido";

  const dispatch = createEventDispatcher();

  const handleClose = () => {
    open = false;
    dispatch("dismiss");
  };

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleKeydown = (event) => {
    const key = event.key;
    if (key === "Escape" || key === "Enter" || key === " ") {
      handleClose();
    }
  };
</script>

{#if open}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    aria-label="Cerrar aviso de temporada"
    on:click={handleBackdrop}
    on:keydown={handleKeydown}
    transition:fade={{ duration: 180 }}
  >
    <div class="card" transition:fly={{ y: 18, duration: 240 }}>
      <div class="badge">Fin de temporada</div>
      <h2>{title}</h2>
      <p>{message}</p>
      <div class="actions">
        <button type="button" on:click={handleClose}>{cta}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));
    backdrop-filter: blur(6px);
  }

  .card {
    position: relative;
    width: min(520px, 92vw);
    padding: 28px 26px 24px;
    border-radius: 24px;
    background: linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);
    overflow: hidden;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(46, 140, 120, 0.12);
    color: #1f5f52;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  h2 {
    margin: 14px 0 8px;
    font-size: 22px;
    font-weight: 700;
    color: #1f2a26;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #4b5b56;
  }

  .actions {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
  }

  button {
    border: none;
    border-radius: 12px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #2e8c78, #1f6d5e);
    box-shadow: 0 10px 18px rgba(46, 140, 120, 0.28);
    cursor: pointer;
  }

  button:hover {
    filter: brightness(1.05);
  }

  button:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    .card {
      padding: 22px 20px;
    }

    h2 {
      font-size: 20px;
    }
  }
</style>
