import React from 'react'

export default function ActionCell({
  condition,
  conditionColumnClass,
  IconFunction,
  actionText,
  label,
  value,
  onClick
}) {
  return (
    <div
      className={`cell-content ${condition ? conditionColumnClass : ''}`}
      onClick={condition ? onClick : undefined}
    >
      {condition && (
        <div className="row-condition" onClick={onClick}>
          <div>
            {IconFunction()}
            <span>{actionText}</span>
          </div>
        </div>
      )}
      <label>{label}</label>
      <span>
        {value}
        {condition && IconFunction()}
      </span>
    </div>
  )
}