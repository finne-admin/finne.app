<script>
  export let users = []
  export let rewards = {}
  export let scopeLabel = ''
  export let loading = false

  const placeholderUser = {
    id: 'placeholder',
    first_name: 'Por definir',
    last_name: '',
    avatar_url: '',
    periodical_exp: 0,
  }

  const layout = [
    { place: 2, className: 'second', bump: 'down', delay: 0.05 },
    { place: 1, className: 'first', bump: 'up', delay: 0 },
    { place: 3, className: 'third', bump: 'down', delay: 0.1 },
  ]

  const toArray = (value) => (Array.isArray(value) ? value : [])

  const resolveReward = (place) => rewards?.[place] || rewards?.[String(place)]

  let playId = 0
  let signature = ''

  $: podiumUsers = [...toArray(users)].slice(0, 3)
  $: {
    while (podiumUsers.length < 3) podiumUsers.push(placeholderUser)
  }

  $: {
    const ids = podiumUsers.map((user) => user?.id ?? '').join('|')
    const rewardSignature = rewards
      ? Object.keys(rewards)
          .sort()
          .map((key) => `${key}:${rewards[key]?.title ?? ''}`)
          .join('|')
      : ''
    const nextSignature = `${ids}-${rewardSignature}-${loading}-${scopeLabel}`
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
      <span>Recompensa especial para el Top 3</span>
    </div>
  </header>

  {#key playId}
    <div class="podium-grid">
      {#each layout as slot, index (slot.place)}
        {#if podiumUsers[slot.place - 1]}
          {#key `${podiumUsers[slot.place - 1].id}-${slot.place}`}
            <article
              class={`podium-card ${slot.className} ${slot.bump}`}
              style={`--delay:${slot.delay + index * 0.35}s;`}
            >
              <div class="podium-meta">
                <span class="place">{slot.place} lugar</span>
                {#if podiumUsers[slot.place - 1].id !== 'placeholder'}
                  <span class="xp">+{podiumUsers[slot.place - 1].periodical_exp} XP</span>
                {/if}
              </div>

              {#if resolveReward(slot.place)}
                <div class="reward">
                  {#if resolveReward(slot.place).image_url}
                    <img
                      src={resolveReward(slot.place).image_url}
                      alt={resolveReward(slot.place).title}
                      loading="lazy"
                    />
                  {/if}
                  <p class="reward-title">{resolveReward(slot.place).title}</p>
                  {#if resolveReward(slot.place).description}
                    <p class="reward-desc">{resolveReward(slot.place).description}</p>
                  {/if}
                  {#if resolveReward(slot.place).cta_url}
                    <a href={resolveReward(slot.place).cta_url} target="_blank" rel="noreferrer">
                      Ver mas
                    </a>
                  {/if}
                </div>
              {:else}
                <div class="reward empty">Recompensa pendiente</div>
              {/if}

              <div class="winner">
                {#if podiumUsers[slot.place - 1].id === 'placeholder'}
                  <span class="empty-winner">Aun sin ganador</span>
                {:else}
                  {#if podiumUsers[slot.place - 1].avatar_url}
                    <img
                      src={podiumUsers[slot.place - 1].avatar_url}
                      alt={podiumUsers[slot.place - 1].first_name}
                      class="avatar"
                      loading="lazy"
                    />
                  {:else}
                    <div class="avatar fallback">
                      {(podiumUsers[slot.place - 1].first_name || podiumUsers[slot.place - 1].last_name || '?')
                        .charAt(0)}
                    </div>
                  {/if}
                  <div class="winner-meta">
                    <p>{podiumUsers[slot.place - 1].first_name} {podiumUsers[slot.place - 1].last_name}</p>
                    <span>+{podiumUsers[slot.place - 1].periodical_exp} XP</span>
                  </div>
                {/if}
              </div>
            </article>
          {/key}
        {/if}
      {/each}
    </div>
  {/key}

  {#if loading}
    <div class="loading">Cargando clasificaciones...</div>
  {/if}
</section>

<style>
  :global(:root) {
    --podium-accent: #10b981;
  }
  .podium-wrap {
    border-radius: 32px;
    border: 1px solid rgba(16, 185, 129, 0.18);
    background: radial-gradient(circle at top, #ecfdf5 0%, #ffffff 45%, #f0fdf4 100%);
    padding: 28px;
    box-shadow: 0 30px 60px rgba(15, 118, 110, 0.08);
  }
  .podium-header {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(16, 185, 129, 0.12);
    padding-bottom: 16px;
  }
  .eyebrow {
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-weight: 600;
    color: #10b981;
  }
  h2 {
    margin: 6px 0 0;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
  }
  .scope {
    margin-top: 4px;
    font-size: 13px;
    color: #64748b;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #0f766e;
  }
  .badge-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
    background: conic-gradient(from 180deg, #34d399, #bbf7d0, #34d399);
    position: relative;
  }
  .badge-icon::after {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: #ecfdf5;
  }
  .podium-grid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    gap: 18px;
  }
  .podium-card {
    border-radius: 28px;
    border: 1px solid transparent;
    padding: 18px;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    opacity: 0;
    transform: translateY(18px) scale(0.98);
    animation-delay: var(--delay);
  }
  .podium-card.up {
    transform: translateY(12px) scale(1);
  }
  .podium-card.first {
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.05));
    border-color: rgba(16, 185, 129, 0.3);
    min-height: 300px;
  }
  .podium-card.second {
    background: linear-gradient(180deg, rgba(52, 211, 153, 0.18), rgba(236, 253, 245, 0.2));
    border-color: rgba(52, 211, 153, 0.25);
    min-height: 260px;
  }
  .podium-card.third {
    background: linear-gradient(180deg, rgba(187, 247, 208, 0.3), rgba(255, 255, 255, 0.5));
    border-color: rgba(187, 247, 208, 0.4);
    min-height: 230px;
  }
  .podium-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: #64748b;
  }
  .place {
    color: #0f766e;
  }
  .xp {
    color: #94a3b8;
  }
  .reward {
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.75);
    padding: 12px;
    text-align: center;
    font-size: 12px;
    color: #0f172a;
    box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
    min-height: 168px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
  }
  .reward img {
    width: 100%;
    height: 110px;
    object-fit: contain;
    border-radius: 14px;
    background: #ffffff;
    margin-bottom: 10px;
  }
  .reward-title {
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }
  .reward-desc {
    margin: 6px 0 0;
    font-size: 11px;
    color: #6b7280;
  }
  .reward a {
    display: inline-block;
    margin-top: 8px;
    background: #10b981;
    color: #ffffff;
    font-size: 11px;
    padding: 6px 12px;
    border-radius: 999px;
    text-decoration: none;
  }
  .reward a:hover {
    background: #059669;
  }
  .reward.empty {
    border: 1px dashed rgba(148, 163, 184, 0.5);
    background: rgba(255, 255, 255, 0.6);
    color: #6b7280;
  }
  .winner {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    object-fit: cover;
    background: #f8fafc;
    box-shadow: 0 10px 20px rgba(15, 118, 110, 0.12);
  }
  .avatar.fallback {
    display: grid;
    place-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    background: rgba(255, 255, 255, 0.8);
  }
  .winner-meta p {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
  .winner-meta span {
    font-size: 12px;
    color: #94a3b8;
  }
  .empty-winner {
    font-size: 12px;
    color: #94a3b8;
  }
  .loading {
    margin-top: 18px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
  }
  @keyframes rise {
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @media (max-width: 900px) {
    .podium-grid {
      grid-template-columns: 1fr;
    }
    .podium-card {
      min-height: auto;
    }
  }
</style>
