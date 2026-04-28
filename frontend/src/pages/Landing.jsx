import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from "../sections/Hero";
import Servicios from "../sections/Servicios";
import Pasos from "../sections/Pasos";
import EmpiezaAhora from '../sections/EmpiezaAhora';
import Nosotros from '../sections/Nosotros';

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#nosotros') {
      const section = document.getElementById('nosotros');
      if (section) {
        // Retraso para asegurar renderizado
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Sube arriba si no hay hash
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div>
      <Hero />
      <Servicios />
      <Pasos />
      <EmpiezaAhora />
      <Nosotros />
    </div>
  );
}