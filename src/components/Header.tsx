import React from 'react'

export default function Header(props) {
  const { children, label, id } = props
  return (
    <div className={`mtr-header`}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
    </div>
  )
}