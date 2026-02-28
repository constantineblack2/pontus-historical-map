import React from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';

/**
 * MenuButton - Hamburger menu toggle for left sidebar
 * 
 * @param {boolean} isOpen - Whether menu is open
 * @param {Function} onToggle - Callback when button is clicked
 */
function MenuButton({ isOpen, onToggle }) {
  const { isDark: darkMode } = useThemeContext();

  return (
    <button 
      className={`menu-button ${darkMode ? 'dark' : ''} ${!isOpen ? 'menu-button-closed' : ''}`}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span className="menu-icon"></span>
      <span className="menu-icon"></span>
      <span className="menu-icon"></span>
    </button>
  );
}

export default React.memo(MenuButton);
