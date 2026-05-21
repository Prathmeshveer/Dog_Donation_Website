import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatWeDo from "./components/WhatWeDo";
import ImpactStats from "./components/ImpactStats";
import Hostel from "./components/Hostel";
import Team from "./components/Team";
import Donate from "./components/Donate";
import DonorList from "./components/DonorList";
import Contact from "./components/Contact";

export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <Hero />
      <About />
      <WhatWeDo />
      <ImpactStats />
      <Hostel />
      <Team />
      <Donate />
      <DonorList />
      <Contact />
    </div>
  );
}
