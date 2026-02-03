<svelte:options customElement="svelte-user-stats-panel" />

<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  export let name = "Usuario";
  export let email = "";
  export let summary = "";
  export let timeSummary = "";
  export let weeklyActiveDays = "";
  export let xpHistory = "";
  export let categoryDistribution = "";
  export let favoriteVideos = "";
  export let insights = "";
  export let xpTotal = 0;
  export let xpLimit = 10;
  export let xpOffset = 0;
  export let xpFrom = "";
  export let xpTo = "";

  const parse = (value, fallback) => {
    if (!value) return fallback;
    if (typeof value !== "string") return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  $: summaryData = parse(summary, {
    total_exercises: 0,
    weekly_sessions: 0,
    avg_satisfaction: 0,
    distinct_days: 0,
  });
  $: timeData = parse(timeSummary, { week_minutes: 0, month_minutes: 0 });
  $: activeDays = parse(weeklyActiveDays, []);
  $: xpItems = parse(xpHistory, []);
  $: categories = parse(categoryDistribution, []);
  $: favorites = parse(favoriteVideos, []);
  $: insightItems = parse(insights, []);

  const formatMinutes = (minutes) => {
    if (!minutes) return "0 min";
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = minutes / 60;
    return `${hours.toFixed(1)} h`;
  };

  const getXpLabel = (entry) => {
    const source = entry?.metadata?.source || entry?.action_type || "XP";
    if (source === "achievement") {
      const title = entry?.metadata?.achievement_title;
      if (title) return `Logro · ${title}`;
      return "Logro";
    }
    if (source === "weekly_challenge") return "Reto semanal";
    if (source === "questionnaire") return "Cuestionario";
    if (source === "active_pause" || source === "pause") return "Pausa activa";
    return "XP";
  };

  const formatTimestamp = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const dispatch = createEventDispatcher();
  let xpOpen = false;
  let filterFrom = xpFrom;
  let filterTo = xpTo;
  let lastXpFrom = xpFrom;
  let lastXpTo = xpTo;
  $: if (xpFrom !== lastXpFrom) {
    filterFrom = xpFrom;
    lastXpFrom = xpFrom;
  }
  $: if (xpTo !== lastXpTo) {
    filterTo = xpTo;
    lastXpTo = xpTo;
  }
  $: safeLimit = Number(xpLimit) || 10;
  $: safeOffset = Number(xpOffset) || 0;
  $: totalCount = Number(xpTotal) || xpItems.length;
  $: shownCount = Math.min(safeOffset + xpItems.length, totalCount);
</script>

<div class="panel">
  <section class="hero">
    <div>
      <p class="eyebrow">Estadísticas avanzadas</p>
      <h1>{name}</h1>
      {#if email}
        <p class="email">{email}</p>
      {/if}
    </div>
    <div class="hero-cards">
      <div class="hero-card">
        <span>Total de pausas</span>
        <strong>{summaryData.total_exercises}</strong>
      </div>
      <div class="hero-card accent">
        <span>Sesiones esta semana</span>
        <strong>{summaryData.weekly_sessions}</strong>
      </div>
      <div class="hero-card">
        <span>Satisfacción promedio</span>
        <strong>{Number(summaryData.avg_satisfaction || 0).toFixed(1)} / 5</strong>
      </div>
    </div>
    <div class="orb" />
    <div class="orb small" />
  </section>

  <section class="grid">
    <div class="card">
      <span>Días activos</span>
      <strong>{summaryData.distinct_days}</strong>
    </div>
    <div class="card">
      <span>Tiempo saludable (7 días)</span>
      <strong>{formatMinutes(timeData.week_minutes)}</strong>
    </div>
    <div class="card">
      <span>Tiempo saludable (30 días)</span>
      <strong>{formatMinutes(timeData.month_minutes)}</strong>
    </div>
  </section>

  <section class="section">
      <div class="row">
        <h2>Actividad semanal</h2>
        <span class="muted">{activeDays.length}/7 días activos</span>
      </div>
      <div class="days">
        {#each ["L", "M", "X", "J", "V", "S", "D"] as label, index}
          <span class:active={activeDays.includes(index + 1)}>{label}</span>
        {/each}
      </div>
  </section>

  <section class="section xp">
    <button type="button" class="xp-toggle" on:click={() => (xpOpen = !xpOpen)}>
      <div>
        <h2>Historial de XP</h2>
        <p class="muted">Últimos movimientos</p>
      </div>
      <span class:rotated={xpOpen}>⌄</span>
    </button>
    {#if xpOpen}
      <div class="xp-controls">
        <label>
          Desde
          <input type="date" bind:value={filterFrom} />
        </label>
        <label>
          Hasta
          <input type="date" bind:value={filterTo} />
        </label>
        <button
          type="button"
          class="ghost"
          on:click|preventDefault={() => {
            filterFrom = "";
            filterTo = "";
            dispatch("xpfilter", { from: "", to: "" });
          }}
        >
          Limpiar
        </button>
        <button
          type="button"
          class="apply"
          on:click|preventDefault={() => {
            dispatch("xpfilter", { from: filterFrom, to: filterTo });
          }}
        >
          Aplicar
        </button>
      </div>
      {#if xpItems.length === 0}
        <p class="muted" transition:fly={{ y: 6, duration: 180 }}>Sin movimientos recientes.</p>
      {:else}
        <div class="list" transition:fly={{ y: 6, duration: 180 }}>
            {#each xpItems as entry}
              <div class="list-item">
              <div>
                <span>{getXpLabel(entry)}</span>
                <span class="timestamp">{formatTimestamp(entry?.created_at)}</span>
              </div>
              <span class="accent">+{entry?.points ?? 0} PA</span>
              </div>
            {/each}
        </div>
        <div class="xp-footer">
          <span class="muted">Mostrando {shownCount} de {totalCount}</span>
          {#if shownCount < totalCount}
            <button
              type="button"
              class="apply"
              on:click|preventDefault={() => {
                dispatch("xploadmore", { nextOffset: safeOffset + safeLimit });
              }}
            >
              Ver más
            </button>
          {/if}
        </div>
      {/if}
    {/if}
  </section>

  <section class="grid two">
    <div class="card">
      <h3>Categorías favoritas</h3>
      {#if categories.length === 0}
        <p class="muted">Sin actividad registrada.</p>
      {:else}
        {#each categories.slice(0, 8) as cat}
          <div class="line">
            <span>{cat.category}</span>
            <strong>{cat.total_sessions}</strong>
          </div>
        {/each}
      {/if}
    </div>
    <div class="card">
      <h3>Ejercicios más repetidos</h3>
      {#if favorites.length === 0}
        <p class="muted">Aún no hay ejercicios destacados.</p>
      {:else}
        {#each favorites.slice(0, 8) as fav}
          <div class="line">
            <span>{fav.title}</span>
            <strong>{fav.total_sessions}x</strong>
          </div>
        {/each}
      {/if}
    </div>
  </section>

  <section class="section">
    <h2>Insights</h2>
    {#if insightItems.length === 0}
      <p class="muted">Sin insights por ahora.</p>
    {:else}
      <ul>
        {#each insightItems as item}
          <li>{item}</li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style>
  :host {
    display: block;
    font-family: inherit;
  }

  .panel {
    display: grid;
    gap: 18px;
    animation: panel-rise 0.4s ease;
  }

  .hero {
    position: relative;
    border-radius: 22px;
    padding: 18px 20px;
    background: linear-gradient(130deg, #f8fafc, #ecfdf5);
    border: 1px solid #e2e8f0;
    display: grid;
    gap: 14px;
    overflow: hidden;
  }

  .hero-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }

  .hero-card {
    border-radius: 16px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(226, 232, 240, 0.9);
    display: grid;
    gap: 4px;
  }

  .hero-card.accent {
    background: linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));
    border-color: rgba(16, 185, 129, 0.4);
  }

  .orb {
    position: absolute;
    right: 18px;
    top: -10px;
    width: 120px;
    height: 120px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);
    animation: float 6s ease-in-out infinite;
  }

  .orb.small {
    right: 120px;
    top: 60px;
    width: 72px;
    height: 72px;
    animation-delay: 1.4s;
    opacity: 0.7;
  }

  .eyebrow {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: #94a3b8;
    margin: 0 0 6px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
  }

  .email {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 13px;
  }

  .grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .grid.two {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 14px;
    display: grid;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }

  .card span {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }

  .card strong {
    font-size: 20px;
    color: #0f172a;
  }

  .section {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px;
    position: relative;
  }

  .xp {
    overflow: hidden;
  }

  .xp-toggle {
    width: 100%;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    padding: 0;
    margin-bottom: 10px;
  }

  .xp-toggle h2 {
    margin: 0;
  }

  .xp-toggle span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    width: 28px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #10b981;
    transition: transform 0.2s ease;
    font-weight: 700;
  }

  .xp-toggle span.rotated {
    transform: rotate(180deg);
  }

  .xp-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 10px;
  }

  .xp-controls label {
    display: grid;
    gap: 4px;
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .xp-controls input {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 6px 8px;
    font-size: 12px;
    color: #0f172a;
    background: #fff;
  }

  .xp-controls .ghost,
  .xp-controls .apply,
  .xp-footer .apply {
    border: none;
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .xp-controls .ghost {
    background: #f1f5f9;
    color: #334155;
  }

  .xp-controls .apply,
  .xp-footer .apply {
    background: #10b981;
    color: #fff;
  }

  .xp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }

  .section h2 {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .days {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .days span {
    height: 36px;
    width: 36px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
    background: #f1f5f9;
    color: #94a3b8;
  }

  .days span.active {
    background: #10b981;
    color: #ffffff;
  }

  .list {
    display: grid;
    gap: 8px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 12px;
    color: #334155;
  }

  .list-item .timestamp {
    display: block;
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .accent {
    color: #10b981;
    font-weight: 700;
  }

  .line {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #334155;
    padding: 4px 0;
  }

  .muted {
    color: #94a3b8;
    font-size: 13px;
  }

  ul {
    margin: 0;
    padding-left: 18px;
    color: #475569;
    display: grid;
    gap: 6px;
    font-size: 13px;
  }

  @keyframes panel-rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(12px);
    }
  }
</style>
