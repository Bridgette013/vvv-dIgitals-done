import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4">
            <img src={logo} alt="Logo" className="h-12" />
        </header>
    );
};

export default Header;
