<script>
  import { createEventDispatcher } from "svelte"

  export let open = false
  export let categories = []
  export let submitting = false
  export let error = ""
  export let success = false
  export let title = "Reportar un problema"
  export let hint = "Cuéntanos qué ha ocurrido para poder ayudarte."
  export let canViewInbox = false
  export let inboxLabel = "Abrir buzón de reports"
  export let attachmentName = ""
  export let attachmentUrl = ""
  export let attachmentUploading = false

  let selected = ""
  let message = ""
  const MIN_MESSAGE_LENGTH = 5
  const MAX_MESSAGE_LENGTH = 1000
  const dispatch = createEventDispatcher()

  $: trimmedMessage = message.trim()
  $: remaining = MAX_MESSAGE_LENGTH - message.length
  $: canSubmit = Boolean(selected) && trimmedMessage.length >= MIN_MESSAGE_LENGTH && !submitting

  const resetForm = () => {
    selected = ""
    message = ""
  }

  const close = () => {
    dispatch("close")
  }

  const submit = () => {
    if (!canSubmit) return
    dispatch("submit", { category: selected, message })
  }

  const openInbox = () => {
    dispatch("inboxclick")
  }

  const handleFileChange = (event) => {
    const file = event?.currentTarget?.files?.[0] ?? null
    dispatch("attachmentchange", { file })
    event.currentTarget.value = ""
  }

  const clearAttachment = () => {
    dispatch("attachmentchange", { file: null })
  }

  $: if (success) {
    resetForm()
  }
</script>

{#if open}
  <div
    class="backdrop"
    role="button"
    tabindex="0"
    on:click={close}
    on:keydown={(event) => event.key === "Escape" && close()}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <div class="card" role="dialog" aria-modal="true" on:click|stopPropagation>
      <div class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Soporte</span>
          <p class="title">{title}</p>
          <p class="hint">{hint}</p>
        </div>
        <button class="close" type="button" on:click={close}>×</button>
      </div>

      <div class="body">
        <div class="field">
          <div class="field-head">
            <label class="label" for="report-category">Categoría</label>
            <span class="caption">Obligatorio</span>
          </div>
          <select id="report-category" bind:value={selected} class="select">
            <option value="" disabled>Selecciona una categoria</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <div class="field-head">
            <label class="label" for="report-message">Mensaje</label>
            <span class:danger={remaining < 0} class="caption">{Math.max(message.length, 0)}/{MAX_MESSAGE_LENGTH}</span>
          </div>
          <textarea
            id="report-message"
            bind:value={message}
            class="textarea"
            rows="6"
            maxlength={MAX_MESSAGE_LENGTH}
            placeholder="Ejemplo: al abrir notificaciones se queda cargando y no puedo volver atrás."
          />
        </div>

        <div class="field">
          <div class="field-head">
            <label class="label" for="report-attachment">Imagen</label>
            <span class="caption">Opcional · PNG, JPG, WEBP o GIF</span>
          </div>
          <div class="attachment-row">
            <label class="attach-button" for="report-attachment">
              {attachmentUploading ? "Subiendo..." : attachmentName ? "Cambiar imagen" : "Adjuntar imagen"}
            </label>
            <input
              id="report-attachment"
              class="file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              on:change={handleFileChange}
            />
            {#if attachmentName}
              <button class="ghost small" type="button" on:click={clearAttachment}>Quitar</button>
            {/if}
          </div>

          {#if attachmentName}
            <div class="attachment-preview">
              <div>
                <p class="attachment-name">{attachmentName}</p>
                <p class="attachment-caption">{attachmentUploading ? "Subiendo imagen..." : "Imagen lista para adjuntar"}</p>
              </div>
              {#if attachmentUrl}
                <img src={attachmentUrl} alt="Adjunto del report" />
              {/if}
            </div>
          {/if}
        </div>

        {#if error}
          <div class="error">{error}</div>
        {/if}
        {#if success}
          <div class="success">Reporte enviado. ¡Gracias!</div>
        {/if}
      </div>

      <div class="footer">
        <div class="footer-left">
          {#if canViewInbox}
            <button class="secondary" type="button" on:click={openInbox}>{inboxLabel}</button>
          {/if}
        </div>
        <div class="footer-right">
          <button class="ghost" type="button" on:click={close}>Cancelar</button>
          <button
            class="primary"
            type="button"
            disabled={!canSubmit}
            on:click={submit}
          >
            {submitting ? "Enviando..." : "Enviar reporte"}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 30%),
      rgba(15, 23, 42, 0.42);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 24px;
  }
  .card {
    width: min(760px, 100%);
    background:
      linear-gradient(180deg, rgba(255, 247, 247, 0.92), rgba(255, 255, 255, 0.98) 28%),
      #ffffff;
    border-radius: 28px;
    border: 1px solid rgba(226, 232, 240, 0.95);
    box-shadow: 0 30px 90px rgba(15, 23, 42, 0.24);
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px;
    box-sizing: border-box;
    max-height: calc(100vh - 48px);
    overflow: auto;
  }
  .hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  .hero-copy {
    max-width: 580px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: #fff1f2;
    color: #be123c;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 10px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
  }
  .hint {
    font-size: 15px;
    line-height: 1.45;
    margin: 6px 0 0;
    color: #475569;
  }
  .close {
    border: none;
    background: rgba(241, 245, 249, 0.96);
    color: #475569;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 24px;
  }
  .body {
    display: grid;
    gap: 14px;
  }
  .field {
    display: grid;
    gap: 10px;
  }
  .field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .label {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
  }
  .caption {
    font-size: 12px;
    color: #94a3b8;
  }
  .caption.danger {
    color: #b91c1c;
  }
  .select,
  .textarea {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #d7dee8;
    border-radius: 18px;
    padding: 14px 16px;
    font-size: 15px;
    outline: none;
    background: rgba(255, 255, 255, 0.92);
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }
  .select:focus,
  .textarea:focus {
    border-color: #fb7185;
    box-shadow: 0 0 0 4px rgba(251, 113, 133, 0.12);
  }
  .textarea {
    resize: vertical;
    min-height: 120px;
    max-height: 220px;
    line-height: 1.5;
    font-family: inherit;
  }
  .attachment-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .attach-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d7dee8;
    background: #ffffff;
    color: #475569;
    padding: 11px 16px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
  }
  .file-input {
    display: none;
  }
  .attachment-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 18px;
    padding: 12px 14px;
  }
  .attachment-preview img {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
  }
  .attachment-name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
  }
  .attachment-caption {
    margin: 4px 0 0;
    font-size: 12px;
    color: #64748b;
  }
  .error {
    font-size: 13px;
    color: #b91c1c;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 12px 14px;
    border-radius: 14px;
  }
  .success {
    font-size: 13px;
    color: #047857;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 12px 14px;
    border-radius: 14px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .footer-left,
  .footer-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ghost {
    border: 1px solid #d7dee8;
    background: #ffffff;
    color: #475569;
    padding: 11px 18px;
    border-radius: 999px;
    cursor: pointer;
  }
  .ghost.small {
    padding: 9px 14px;
    font-size: 13px;
  }
  .secondary {
    border: 1px solid #fda4af;
    background: #fff1f2;
    color: #be123c;
    padding: 11px 16px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
  }
  .primary {
    border: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #ffffff;
    padding: 11px 18px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 700;
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.28);
  }
  .primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
  @media (max-width: 640px) {
    .card {
      width: 100%;
      padding: 18px;
      border-radius: 24px;
      max-height: calc(100vh - 24px);
    }
    .footer {
      flex-direction: column;
      align-items: stretch;
    }
    .footer-left,
    .footer-right {
      width: 100%;
      justify-content: stretch;
    }
    .footer-left > button,
    .footer-right > button {
      flex: 1 1 0;
    }
  }
</style>
