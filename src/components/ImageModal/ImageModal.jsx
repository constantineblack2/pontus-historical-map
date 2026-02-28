import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ANIMATION } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ImageModal - Full-screen image viewer with navigation
 * 
 * @param {boolean} isOpen - Whether modal is visible
 * @param {string[]} images - Array of image URLs
 * @param {number} currentIndex - Current image index
 * @param {string} cityName - Name of city being viewed
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onNext - Callback for next image
 * @param {Function} onPrev - Callback for previous image
 */
function ImageModal({
  isOpen,
  images,
  currentIndex,
  cityName,
  currentImage,
  onClose,
  onNext,
  onPrev
}) {
  const prefersReducedMotion = useReducedMotion();

  const getAnimationDuration = (baseDuration) => {
    return prefersReducedMotion ? 0 : baseDuration;
  };

  const handleImageNext = (e) => {
    e.stopPropagation();
    onNext();
  };

  const handleImagePrev = (e) => {
    e.stopPropagation();
    onPrev();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div 
          className="image-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={onClose}>×</button>
            
            {images.length > 1 && (
              <>
                <button className="image-modal-nav image-modal-prev" onClick={handleImagePrev}>‹</button>
                <button className="image-modal-nav image-modal-next" onClick={handleImageNext}>›</button>
              </>
            )}
            
            <Motion.img 
              key={currentImage}
              src={currentImage}
              loading="lazy"
              alt={`${cityName} - enlarged view`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: getAnimationDuration(ANIMATION.IMAGE_MODAL_DURATION) }}
            />
            
            {images.length > 1 && (
              <div className="image-modal-caption">
                {cityName} - {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(ImageModal);
