import { Faq } from './sections/Faq'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { NextStep } from './sections/NextStep'
import { Signup } from './sections/Signup'
import { Studio } from './sections/Studio'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Studio />
        <NextStep />
        <Faq />
        <Signup />
      </main>
      <Footer />
    </>
  )
}
