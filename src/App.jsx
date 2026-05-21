import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Admin from "./components/Admin";

function MainSite() {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}