// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = ({ child }) => {
  return (
    <div>
        <nav className="topnav">
            <a href="/">Аннотация</a>
            <a href="/referat">Реферат</a>
            <a href="/key-words">Ключевые слова</a>
        </nav>
      <div className="content">
        {child}
      </div>
    </div>
  );
}

export default Navbar;
