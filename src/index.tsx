import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import 'tailwindcss/tailwind.css';
import App from './App'
import reportWebVitals from './reportWebVitals'

// document.body.style.backgroundImage = 'url(assets/background/main.gif)'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const wheel = document.getElementById('root') as HTMLElement
wheel.addEventListener('wheel', event => {
  if (event.ctrlKey) {
    event.preventDefault()
  }
}, true)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
