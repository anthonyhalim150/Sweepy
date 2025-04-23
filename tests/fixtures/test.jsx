import React from 'react'
import './theme.scss'
import icon from './icon.png'

export function Test() {
  return (
    <div className="used-style">
      <h1>Hello</h1>
      <img src={icon} alt="icon" />
    </div>
  )
}