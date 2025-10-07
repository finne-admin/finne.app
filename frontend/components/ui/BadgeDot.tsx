// components/ui/BadgeDot.tsx
import clsx from 'clsx'

type Props = {
  show?: boolean
  title?: string
  className?: string
  children?: React.ReactNode
  /** 'bubble' = flotante sobre el icono; 'inline' = a la derecha, en línea */
  variant?: 'bubble' | 'inline'
}

export default function BadgeDot({
  show,
  title = 'Tienes elementos por reclamar',
  className,
  children,
  variant = 'bubble',
}: Props) {
  if (!show) return children ? <>{children}</> : null

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center">
        {children}
        <span
          aria-label={title}
          title={title}
          className={clsx(
            // en línea, sin absolute
            'ml-3',
            'ml-2.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold',
            'flex items-center justify-center ring-2 ring-white',
            className
          )}
        >
          !
        </span>
      </span>
    )
  }

  // variant === 'bubble' (por defecto)
  return (
    <span className="relative inline-flex items-center">
      {children}
      <span
        aria-label={title}
        title={title}
        className={clsx(
          'absolute -top-2 -right-3 h-4 w-4 rounded-full bg-red-500',
          'text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white',
          className
        )}
      >
        !
      </span>
    </span>
  )
}
