import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useThemeContext } from '../../contexts/ThemeContext';
import { EXTERNAL_LINKS, ANIMATION } from '../../constants';

/**
 * BottomBar - Footer with theme toggle and GitHub link
 */
function BottomBar() {
  const { isDark: darkMode, toggleDarkMode } = useThemeContext();

  const openGitHub = () => {
    window.open(EXTERNAL_LINKS.GITHUB, '_blank');
  };

  return (
    <Motion.div 
      className="bottom-bar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: ANIMATION.BOTTOM_BAR_DELAY }}
    >
      <button 
        className="bottom-bar-button theme-toggle-bottom"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        <span className="theme-icon">
          <span className={`moon-icon ${darkMode ? 'hidden' : ''}`}></span>
          <span className={`sun-icon ${darkMode ? '' : 'hidden'}`}></span>
        </span>
        <span className="button-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
      
      <button 
        className="bottom-bar-button github-button"
        onClick={openGitHub}
        aria-label="GitHub Profile"
      >
        <span className="github-icon"></span>
        <span className="button-text">GitHub</span>
      </button>
    </Motion.div>
  );
}

export default React.memo(BottomBar);
