
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
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex-shrink-0">
          <AdminButton onClick={onAdminClick} />
        </div>
        <div className="flex-shrink-0">
          <CartButton itemCount={itemCount} onClick={onCartClick} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
