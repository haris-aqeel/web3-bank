import React from 'react'
import Hero from "./components/Hero"
import Features from "./components/Features"
import CTA from "./components/CTA"



export default function App() {
  return (
    <React.Fragment>
      <Hero/>
      <Features/>
      <CTA/>
    </React.Fragment>
  )
}