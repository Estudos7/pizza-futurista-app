
import React from 'react';
import AdminButton from './AdminButton';
import CartButton from './CartButton';

interface FooterProps {
  itemCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ itemCount, onCartClick, onAdminClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-6 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <AdminButton onClick={onAdminClick} />
        <div className="flex-1"></div>
        <CartButton itemCount={itemCount} onClick={onCartClick} />
      </div>
    </footer>
  );
};

export default Footer;
