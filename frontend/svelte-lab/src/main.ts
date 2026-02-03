import SvelteCounter from './SvelteCounter.svelte'
import SvelteOrbitCard from './SvelteOrbitCard.svelte'
import SveltePulseBadge from './SveltePulseBadge.svelte'
import SvelteRippleButton from './SvelteRippleButton.svelte'
import SvelteStaggerList from './SvelteStaggerList.svelte'
import SvelteThermometer from './SvelteThermometer.svelte'
import SveltePodium from './SveltePodium.svelte'
import SvelteBalloonGift from './SvelteBalloonGift.svelte'
import SvelteAchievementCard from './SvelteAchievementCard.svelte'
import SvelteParallaxCard from './SvelteParallaxCard.svelte'
import SvelteFlipCounter from './SvelteFlipCounter.svelte'
import SvelteParallaxStack from './SvelteParallaxStack.svelte'
import SvelteVideoCard from './SvelteVideoCard.svelte'
import SvelteSeasonPopup from './SvelteSeasonPopup.svelte'
import SvelteQuotaToken from './SvelteQuotaToken.svelte'
import SvelteUserStatsPanel from './SvelteUserStatsPanel.svelte'

const defineElement = (tag: string, ctor: unknown) => {
  const elementCtor = (ctor as { element?: CustomElementConstructor }).element
  if (!customElements.get(tag)) {
    customElements.define(tag, elementCtor ?? (ctor as CustomElementConstructor))
  }
}

defineElement('svelte-counter', SvelteCounter)
defineElement('svelte-orbit-card', SvelteOrbitCard)
defineElement('svelte-pulse-badge', SveltePulseBadge)
defineElement('svelte-ripple-button', SvelteRippleButton)
defineElement('svelte-stagger-list', SvelteStaggerList)
defineElement('svelte-thermometer', SvelteThermometer)
defineElement('svelte-podium', SveltePodium)
defineElement('svelte-balloon-gift', SvelteBalloonGift)
defineElement('svelte-achievement-card', SvelteAchievementCard)
defineElement('svelte-parallax-card', SvelteParallaxCard)
defineElement('svelte-flip-counter', SvelteFlipCounter)
defineElement('svelte-parallax-stack', SvelteParallaxStack)
defineElement('svelte-video-card', SvelteVideoCard)
defineElement('svelte-season-popup', SvelteSeasonPopup)
defineElement('svelte-quota-token', SvelteQuotaToken)
defineElement('svelte-user-stats-panel', SvelteUserStatsPanel)
