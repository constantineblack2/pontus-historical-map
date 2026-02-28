import { useState } from 'react';

/**
 * Custom hook for managing image modal state
 * Consolidates: isOpen, images, currentIndex, cityName
 * Provides methods: open, close, nextImage, prevImage
 */
export const useImageModal = () => {
  const initialState = {
    isOpen: false,
    images: [],
    currentIndex: 0,
    cityName: '',
  };

  const [modal, setModal] = useState(initialState);

  const open = (images, startIndex = 0, cityName = '') => {
    setModal({
      isOpen: true,
      images,
      currentIndex: startIndex,
      cityName,
    });
  };

  const close = () => {
    setModal(initialState);
  };

  const nextImage = () => {
    setModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = () => {
    setModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  };

  return {
    isOpen: modal.isOpen,
    images: modal.images,
    currentIndex: modal.currentIndex,
    cityName: modal.cityName,
    currentImage: modal.images[modal.currentIndex] || '',
    open,
    close,
    nextImage,
    prevImage,
  };
};
