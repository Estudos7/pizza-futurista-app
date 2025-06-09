
import React from 'react';

const Header = () => {
  return (
    <header className="gradient-primary py-6 px-4 text-center shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
      <div className="relative z-10">
        <h1 className="font-montserrat text-4xl md:text-5xl font-bold text-white animate-glow">
          PizzaFuturista
        </h1>
        <p className="text-white/90 mt-2 text-sm md:text-base">A Pizzaria do Futuro</p>
      </div>
    </header>
  );
};

export default Header;
