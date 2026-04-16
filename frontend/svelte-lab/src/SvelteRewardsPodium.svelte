<script>
  export let users = []
  export let rewards = {}
  export let rewardMode = "raffle_thresholds"
  export let raffleThresholds = []
  export let userRaffleEntries = 0
  export let scopeLabel = ''
  export let loading = false

  const placeholderUser = {
    id: 'placeholder',
    first_name: 'Por definir',
    last_name: '',
    avatar_url: '',
    periodical_exp: 0,
  }

  const toArray = (value) => (Array.isArray(value) ? value : [])
  const resolveGuaranteedReward = () => rewards?.guaranteed_winner || rewards?.[1] || rewards?.['1']
  const resolveRaffleReward = (key) => rewards?.[key]

  let playId = 0
  let signature = ''

  $: podiumUsers = [...toArray(users)].slice(0, 1)
  $: { while (podiumUsers.length < 1) podiumUsers.push(placeholderUser) }
  $: classicUsers = [...toArray(users)].slice(0, 3)
  $: { while (classicUsers.length < 3) classicUsers.push(placeholderUser) }
  $: activeThresholds = Array.isArray(raffleThresholds)
    ? raffleThresholds.filter((threshold) => threshold?.active).sort((a, b) => (a?.min_points ?? 0) - (b?.min_points ?? 0))
    : []
  $: winner = podiumUsers[0] || placeholderUser

  $: {
    const ids = toArray(users).map((user) => user?.id ?? '').join('|')
    const rewardSignature = rewards
      ? Object.keys(rewards).sort().map((key) => `${key}:${rewards[key]?.title ?? ''}`).join('|')
      : ''
    const thresholdSignature = Array.isArray(raffleThresholds)
      ? raffleThresholds.map((threshold) => `${threshold.id ?? ''}:${threshold.min_points}:${threshold.entries_count}:${threshold.active}`).join('|')
      : ''
    const nextSignature = `${ids}-${rewardMode}-${rewardSignature}-${thresholdSignature}-${userRaffleEntries}-${loading}-${scopeLabel}`
    if (nextSignature !== signature) {
      signature = nextSignature
      playId += 1
    }
  }
</script>

<section class="podium-wrap" data-play={playId}>
  <header class="podium-header">
    <div>
      <p class="eyebrow">Podio temporada</p>
      <h2>Top Activos</h2>
      {#if scopeLabel}
        <p class="scope">{scopeLabel}</p>
      {/if}
    </div>
    <div class="badge">
      <span class="badge-icon" aria-hidden="true"></span>
      <span>{rewardMode === 'classic_top3' ? 'Premios para Top 1, Top 2 y Top 3' : 'Top 1 garantizado + 2 sorteos por umbrales'}</span>
    </div>
  </header>

  {#if rewardMode === 'classic_top3'}
    <div class="classic-grid">
      {#each [
        { place: 2, key: 'raffle_a', className: 'classic-second' },
        { place: 1, key: 'guaranteed_winner', className: 'classic-first' },
        { place: 3, key: 'raffle_b', className: 'classic-third' },
      ] as slot}
        <article class={`classic-card ${slot.className}`}>
          <div class="podium-meta">
            <span class="place">{slot.place} lugar</span>
            {#if classicUsers[slot.place - 1].id !== 'placeholder'}
              <span class="xp">+{classicUsers[slot.place - 1].periodical_exp} XP</span>
            {/if}
          </div>

          {#if rewards?.[slot.key]}
            <div class="reward">
              {#if rewards[slot.key]?.image_url}
                <img src={rewards[slot.key].image_url} alt={rewards[slot.key].title} loading="lazy" />
              {/if}
              <p class="reward-title">{rewards[slot.key].title}</p>
              {#if rewards[slot.key]?.description}
                <p class="reward-desc">{rewards[slot.key].description}</p>
              {/if}
            </div>
          {:else}
            <div class="reward empty">Recompensa pendiente</div>
          {/if}

          <div class="classic-user">
            {#if classicUsers[slot.place - 1].avatar_url}
              <img src={classicUsers[slot.place - 1].avatar_url} alt={classicUsers[slot.place - 1].first_name} class="classic-avatar" loading="lazy" />
            {:else}
              <div class="classic-avatar fallback">
                {(classicUsers[slot.place - 1].first_name || classicUsers[slot.place - 1].last_name || '?').charAt(0)}
              </div>
            {/if}
            <div class="classic-user-meta">
              <p>{classicUsers[slot.place - 1].first_name} {classicUsers[slot.place - 1].last_name}</p>
              <span>+{classicUsers[slot.place - 1].periodical_exp} XP</span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    {#key playId}
      <div class="podium-grid">
        <article class="winner-card">
          <div class="podium-meta">
            <span class="place">Ganador · #1</span>
            {#if winner.id !== 'placeholder'}
              <span class="xp">+{winner.periodical_exp} XP</span>
            {/if}
          </div>

          <div class="winner-layout">
            <div class="winner-identity">
              {#if winner.id === 'placeholder'}
                <div class="winner-avatar fallback">?</div>
              {:else if winner.avatar_url}
                <img src={winner.avatar_url} alt={winner.first_name} class="winner-avatar" loading="lazy" />
              {:else}
                <div class="winner-avatar fallback">{(winner.first_name || winner.last_name || '?').charAt(0)}</div>
              {/if}

              <p class="winner-name">
                {#if winner.id === 'placeholder'}
                  Aun sin ganador
                {:else}
                  {winner.first_name} {winner.last_name}
                {/if}
              </p>
              {#if winner.id !== 'placeholder'}
                <span class="winner-score">+{winner.periodical_exp} XP</span>
              {/if}
            </div>

            {#if resolveGuaranteedReward()}
              <div class="reward">
                {#if resolveGuaranteedReward().image_url}
                  <img src={resolveGuaranteedReward().image_url} alt={resolveGuaranteedReward().title} loading="lazy" />
                {/if}
                <p class="reward-title">{resolveGuaranteedReward().title}</p>
                {#if resolveGuaranteedReward().description}
                  <p class="reward-desc">{resolveGuaranteedReward().description}</p>
                {/if}
                {#if resolveGuaranteedReward().cta_url}
                  <a href={resolveGuaranteedReward().cta_url} target="_blank" rel="noreferrer">Ver mas</a>
                {/if}
              </div>
            {:else}
              <div class="reward empty">
                <div class="empty-copy">
                  <strong>Premio Top 1 pendiente</strong>
                  <span>Configura el premio garantizado para la persona que termine en primera posicion.</span>
                </div>
              </div>
            {/if}
          </div>
        </article>
      </div>
    {/key}

    <div class="extras-grid">
      <article class="extras-card">
        <div class="extras-heading">
          <span class="mini-icon"></span>
          <h3>Premios sorteables</h3>
        </div>
        <div class="raffle-grid">
          {#each [{ key: 'raffle_a', label: 'Sorteo A' }, { key: 'raffle_b', label: 'Sorteo B' }] as item}
            <div class="raffle-card">
              <p class="raffle-label">{item.label}</p>
              {#if resolveRaffleReward(item.key)}
                {#if resolveRaffleReward(item.key).image_url}
                  <img src={resolveRaffleReward(item.key).image_url} alt={resolveRaffleReward(item.key).title} class="raffle-image" loading="lazy" />
                {/if}
                <p class="reward-title">{resolveRaffleReward(item.key).title}</p>
                {#if resolveRaffleReward(item.key).description}
                  <p class="reward-desc">{resolveRaffleReward(item.key).description}</p>
                {/if}
              {:else}
                <div class="reward empty">Premio pendiente de configurar</div>
              {/if}
            </div>
          {/each}
        </div>
      </article>

      <article class="extras-card">
        <div class="extras-heading">
          <span class="mini-icon spark"></span>
          <h3>Participaciones por puntos</h3>
        </div>

        <div class="entries-box">
          <p>Tus participaciones actuales</p>
          <strong>{Number(userRaffleEntries ?? 0).toLocaleString('es-ES')}</strong>
          <span>Se aplica siempre el umbral mas alto que hayas alcanzado.</span>
        </div>

        <div class="threshold-list">
          {#if activeThresholds.length}
            {#each activeThresholds as threshold}
              <div class="threshold-row">
                <span>Desde {Number(threshold.min_points ?? 0).toLocaleString('es-ES')} PA</span>
                <strong>{threshold.entries_count} participac{threshold.entries_count === 1 ? 'ion' : 'iones'}</strong>
              </div>
            {/each}
          {:else}
            <div class="reward empty">Aun no hay umbrales configurados para este ambito.</div>
          {/if}
        </div>
      </article>
    </div>
  {/if}

  {#if loading}
    <div class="loading">Cargando clasificaciones...</div>
  {/if}
</section>

<style>
  .podium-wrap { padding: 0; }
  .podium-header { display:flex; flex-wrap:wrap; gap:16px; justify-content:space-between; align-items:center; padding-bottom:18px; border-bottom:1px solid rgba(148,163,184,.18); }
  .eyebrow { font-size:10px; letter-spacing:.32em; text-transform:uppercase; font-weight:600; color:#10b981; }
  h2 { margin:6px 0 0; font-size:24px; font-weight:700; color:#0f172a; }
  .scope { margin-top:4px; font-size:13px; color:#64748b; }
  .badge { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:#0f766e; background:rgba(236,253,245,.7); padding:8px 12px; border-radius:999px; }
  .badge-icon { width:20px; height:20px; display:inline-block; border-radius:50%; background:conic-gradient(from 180deg,#34d399,#bbf7d0,#34d399); position:relative; }
  .badge-icon::after { content:''; position:absolute; inset:5px; border-radius:50%; background:#ecfdf5; }
  .podium-meta { display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:600; text-transform:uppercase; color:#64748b; }
  .place { color:#0f766e; }
  .xp { color:#94a3b8; }
  .reward { border-radius:20px; background:rgba(255,255,255,.86); padding:14px; text-align:center; font-size:12px; color:#0f172a; box-shadow:inset 0 0 0 1px rgba(148,163,184,.14); min-height:168px; display:flex; flex-direction:column; justify-content:center; gap:6px; }
  .reward img { width:100%; height:110px; object-fit:contain; border-radius:14px; background:#fff; margin-bottom:10px; }
  .reward-title { font-size:13px; font-weight:600; margin:0; }
  .reward-desc { margin:6px 0 0; font-size:11px; color:#6b7280; }
  .reward a { display:inline-block; margin-top:8px; background:#10b981; color:#fff; font-size:11px; padding:6px 12px; border-radius:999px; text-decoration:none; }
  .reward.empty { border:1px dashed rgba(203,213,225,.95); background:rgba(255,255,255,.66); color:#6b7280; text-align:left; justify-content:center; }
  .loading { margin-top:18px; text-align:center; font-size:12px; color:#6b7280; }
  .classic-grid { margin-top:28px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); align-items:start; gap:22px; }
  .classic-card { padding:0; border:none; display:flex; flex-direction:column; gap:14px; min-height:230px; background:transparent; }
  .classic-first, .classic-second, .classic-third { background:transparent; border-color:transparent; }
  .classic-user { margin-top:auto; display:flex; align-items:center; gap:10px; }
  .classic-avatar { width:46px; height:46px; border-radius:50%; object-fit:cover; background:#fff; }
  .classic-avatar.fallback { display:grid; place-items:center; color:#64748b; font-weight:600; }
  .classic-user-meta p { margin:0; font-size:14px; font-weight:600; color:#0f172a; }
  .classic-user-meta span { font-size:12px; color:#94a3b8; }
  .podium-grid { margin-top:28px; display:grid; grid-template-columns:1fr; gap:18px; }
  .winner-card { border:none; background:transparent; padding:0; box-shadow:none; animation:rise .9s cubic-bezier(.22,1,.36,1) forwards; opacity:0; transform:translateY(18px) scale(.98); }
  .winner-layout { margin-top:16px; display:grid; grid-template-columns:auto minmax(0,1fr); gap:16px; align-items:center; }
  .winner-identity { display:flex; flex-direction:column; align-items:center; text-align:center; }
  .winner-avatar { width:80px; height:80px; border-radius:50%; object-fit:cover; background:#fff; box-shadow:0 14px 28px rgba(15,118,110,.12); }
  .winner-avatar.fallback { display:grid; place-items:center; font-size:28px; font-weight:700; color:#64748b; }
  .winner-name { margin:12px 0 0; font-size:24px; font-weight:700; color:#0f172a; }
  .winner-score { margin-top:4px; font-size:14px; color:#64748b; }
  .empty-copy { display:grid; gap:6px; }
  .empty-copy strong { font-size:13px; color:#0f172a; }
  .empty-copy span { font-size:11px; line-height:1.5; }
  .extras-grid { margin-top:26px; display:grid; grid-template-columns:1.1fr .9fr; gap:28px; align-items:start; }
  .extras-card { border:none; background:transparent; padding:0; box-shadow:none; }
  .extras-heading { display:flex; align-items:center; gap:8px; }
  .extras-heading h3 { margin:0; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:#059669; }
  .mini-icon { width:16px; height:16px; border-radius:999px; background:linear-gradient(135deg,#10b981,#bbf7d0); }
  .mini-icon.spark { background:linear-gradient(135deg,#10b981,#34d399,#bbf7d0); }
  .raffle-grid { margin-top:16px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .raffle-card { border-top:1px solid rgba(226,232,240,.8); padding-top:14px; }
  .raffle-label { margin:0 0 10px; font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#64748b; }
  .raffle-image { width:100%; height:110px; object-fit:contain; border-radius:14px; background:#f8fafc; margin-bottom:10px; }
  .entries-box { margin-top:16px; border-radius:18px; background:rgba(16,185,129,.08); padding:16px; }
  .entries-box p { margin:0; font-size:13px; color:#475569; }
  .entries-box strong { display:block; margin-top:6px; font-size:32px; color:#047857; }
  .entries-box span { display:block; margin-top:8px; font-size:11px; color:#64748b; }
  .threshold-list { margin-top:16px; display:grid; gap:10px; }
  .threshold-row { display:flex; justify-content:space-between; gap:12px; align-items:center; border-top:1px solid rgba(226,232,240,.85); padding:12px 2px 0; font-size:13px; color:#475569; }
  .threshold-row strong { color:#0f172a; }
  @keyframes rise { to { opacity:1; transform:translateY(0) scale(1); } }
  @media (max-width: 900px) {
    .classic-grid { grid-template-columns:1fr; }
    .winner-layout { grid-template-columns:1fr; }
    .extras-grid { grid-template-columns:1fr; }
    .raffle-grid { grid-template-columns:1fr; }
  }
</style>
