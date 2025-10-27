import React from 'react'
import Hero from '../components/Hero'
import { Features } from '../components/Features'
import Reviews from '../components/Reviews'
import Faq from '../components/Faq'

export default function Landing() {
  return (
    <div>
        <Hero/>
        <Features/>
        <Reviews/>
        <Faq/>
    </div>
  )
}
