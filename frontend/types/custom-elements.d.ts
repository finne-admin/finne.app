import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'svelte-counter': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        count?: number
      }
      'svelte-orbit-card': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        title?: string
        subtitle?: string
        intensity?: number
        flow?: number
      }
      'svelte-pulse-badge': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        tone?: string
        active?: boolean
      }
      'svelte-ripple-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        tone?: string
      }
      'svelte-stagger-list': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        count?: number
        cadence?: number
      }
      'svelte-thermometer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        value?: number
        min?: number
        max?: number
      }
      'svelte-podium': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        first?: number
        second?: number
        third?: number
        baseDuration?: number
        delayStep?: number
      }
      'svelte-balloon-gift': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        lift?: number
        sway?: number
        speed?: number
        color?: string
        rope?: string
      }
      'svelte-achievement-card': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        title?: string
        subtitle?: string
        description?: string
        progress?: number
        total?: number
        xp?: number
        status?: string
        levelIndex?: number
        levelTotal?: number
      }
      'svelte-parallax-card': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        title?: string
        value?: string
        hint?: string
        intensity?: number
      }
      'svelte-flip-counter': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        value?: number
        tone?: string
      }
      'svelte-parallax-stack': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        title?: string
        intensity?: number
        blurAmount?: number
      }
      'svelte-video-card': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        videoId?: string
        hashedId?: string
        title?: string
        description?: string
        duration?: string
        thumbnail?: string
        selected?: boolean
        disabled?: boolean
        badge?: string
        tags?: string[]
        favorite?: boolean
        categoryLeft?: string
        categoryRight?: string
        categoryLeftColor?: string
        categoryRightColor?: string
      }
    }
  }
}

export {}
