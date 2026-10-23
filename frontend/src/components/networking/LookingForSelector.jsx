import React from 'react'
import { clsx } from 'clsx'
import { LOOKING_FOR_OPTIONS } from '../../constants'

/**
 * LookingForSelector
 * Multi-select chip grid for choosing what kind of connections/opportunities
 * the user is looking for.
 *
 * Answers: WHAT kind of connection am I looking for?
 * (Separate from NetworkingIntentSelector which answers WHY.)
 *
 * Props:
 *  - selected: string[] — currently selected option values
 *  - onChange: (selected: string[]) => void
 *  - label: string — section label
 *  - description: string — helper text
 *  - maxSelect: number — max allowed selections (0 = unlimited)
 */
function LookingForSelector({
  selected = [],
  onChange,
  label = 'What are you looking for?',
  description = 'Select all that apply. This helps us connect you with the right people.',
  maxSelect = 0,
}) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      if (maxSelect > 0 && selected.length >= maxSelect) return
      onChange([...selected, value])
    }
  }

  return (
    <div>
      {label && <label className="label mb-1">{label}</label>}
      {description && (
        <p className="text-sm text-secondary-500 mb-3">{description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {LOOKING_FOR_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value)
          const isDisabled =
            !isSelected && maxSelect > 0 && selected.length >= maxSelect

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              disabled={isDisabled}
              className={clsx(
                'flex flex-col items-start px-4 py-3 rounded-xl text-sm border transition-all text-left select-none',
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-secondary-700 border-secondary-300 hover:border-primary-400 hover:bg-primary-50',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className="font-medium">{option.label}</span>
              <span
                className={clsx(
                  'text-xs mt-0.5',
                  isSelected ? 'text-primary-100' : 'text-secondary-500'
                )}
              >
                {option.description}
              </span>
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

export default LookingForSelector
