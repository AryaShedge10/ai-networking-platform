import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import Problem from "../components/landing/Problem";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import WhyUs from "../components/landing/WhyUs";
import CTA from "../components/landing/CTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <WhyUs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
