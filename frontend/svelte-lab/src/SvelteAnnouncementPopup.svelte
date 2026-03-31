<svelte:options customElement="svelte-announcement-popup" />

<script>
  import { createEventDispatcher } from "svelte"
  import { fade, fly } from "svelte/transition"

  export let open = false
  export let title = "Aviso"
  export let message = ""
  export let cta = "Entendido"

  const dispatch = createEventDispatcher()

  const handleClose = () => {
    open = false
    dispatch("dismiss")
  }

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget) handleClose()
  }

  const handleKeydown = (event) => {
    if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
      handleClose()
    }
  }
</script>

{#if open}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    aria-label="Cerrar aviso"
    on:click={handleBackdrop}
    on:keydown={handleKeydown}
    transition:fade={{ duration: 180 }}
  >
    <div class="card" transition:fly={{ y: 18, duration: 240 }}>
      <div class="eyebrow">Aviso</div>
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
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(0, 0, 0, 0.58));
    backdrop-filter: blur(10px);
  }
  .card {
    width: min(560px, 92vw);
    border-radius: 28px;
    padding: 28px 26px 24px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24), 0 10px 28px rgba(15, 23, 42, 0.12);
    border: 1px solid rgba(226, 232, 240, 0.9);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.12);
    color: #047857;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h2 {
    margin: 14px 0 8px;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
  }
  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: #475569;
    white-space: pre-wrap;
  }
  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  button {
    border: none;
    border-radius: 14px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #059669, #047857);
    box-shadow: 0 12px 24px rgba(5, 150, 105, 0.24);
    cursor: pointer;
  }
</style>
