import React from 'react';
import '../index.css';
import logo from '../images/logo/logo-header.svg';

function Header() {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип Mesto Russia" />
        </header>
    );
}

export default Header; 