import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4">
            <img src={logo} alt="Logo" className="w-64 h-auto object-contain" />
                </header>
    );
};

export default Header;
