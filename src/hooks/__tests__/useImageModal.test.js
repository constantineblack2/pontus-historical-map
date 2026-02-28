import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useImageModal } from '../useImageModal';

describe('useImageModal', () => {
  it('initializes with modal closed', () => {
    const { result } = renderHook(() => useImageModal());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.images).toEqual([]);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.cityName).toBe('');
    expect(result.current.currentImage).toBe('');
  });

  it('opens modal with images and startIndex', () => {
    const { result } = renderHook(() => useImageModal());
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

    act(() => {
      result.current.open(images, 1, 'Test City');
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.images).toEqual(images);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.cityName).toBe('Test City');
    expect(result.current.currentImage).toBe('img2.jpg');
  });

  it('navigates to next image with wrapping', () => {
    const { result } = renderHook(() => useImageModal());
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

    act(() => {
      result.current.open(images, 0, 'Test City');
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');

    act(() => {
      result.current.nextImage();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentImage).toBe('img2.jpg');

    // Wrap around to beginning
    act(() => {
      result.current.nextImage();
      result.current.nextImage();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');
  });

  it('navigates to previous image with wrapping', () => {
    const { result } = renderHook(() => useImageModal());
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

    act(() => {
      result.current.open(images, 1, 'Test City');
    });

    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.prevImage();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');

    // Wrap around to end
    act(() => {
      result.current.prevImage();
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentImage).toBe('img3.jpg');
  });

  it('closes modal and resets to initial state', () => {
    const { result } = renderHook(() => useImageModal());
    const images = ['img1.jpg', 'img2.jpg'];

    act(() => {
      result.current.open(images, 0, 'Test City');
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.images).toEqual([]);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.cityName).toBe('');
  });

  it('handles single image modal', () => {
    const { result } = renderHook(() => useImageModal());
    const images = ['img1.jpg'];

    act(() => {
      result.current.open(images, 0, 'Test City');
    });

    expect(result.current.currentImage).toBe('img1.jpg');

    act(() => {
      result.current.nextImage();
    });

    // Should wrap to same image
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');
  });
});
