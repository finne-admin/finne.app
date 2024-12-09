interface ProgressBarProps {
  value: number
  max: number
  label: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
    </div>
  )
}

