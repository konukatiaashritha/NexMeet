import React from 'react'
import { clsx } from 'clsx'
import { NETWORKING_GOALS } from '../../constants'

/**
 * NetworkingIntentSelector
 * Multi-select chip grid for choosing networking goals.
 *
 * Props:
 *  - selected: string[] — currently selected goal values
 *  - onChange: (selected: string[]) => void
 *  - label: string — section label
 *  - description: string — helper text
 *  - maxSelect: number — max allowed selections (0 = unlimited)
 */
function NetworkingIntentSelector({
  selected = [],
  onChange,
  label = 'What are you looking for?',
  description = 'Select all that apply. This helps us suggest the right people and events for you.',
  maxSelect = 0,
}) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      if (maxSelect > 0 && selected.length >= maxSelect) return
      onChange([...selected, value])
    }
  }

  return (
    <div>
      {label && (
        <label className="label mb-1">{label}</label>
      )}
      {description && (
        <p className="text-sm text-secondary-500 mb-3">{description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {NETWORKING_GOALS.map((goal) => {
          const isSelected = selected.includes(goal.value)
          const isDisabled = !isSelected && maxSelect > 0 && selected.length >= maxSelect

          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggle(goal.value)}
              disabled={isDisabled}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all select-none',
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-secondary-700 border-secondary-300 hover:border-primary-400 hover:bg-primary-50',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span>{goal.icon}</span>
              <span>{goal.label.replace(/^.+ /, '')}</span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-secondary-500 mt-2">
          {selected.length} selected
          {maxSelect > 0 && ` (max ${maxSelect})`}
        </p>
      )}
    </div>
  )
}

export default NetworkingIntentSelector
