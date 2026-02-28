import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    // Mock matchMedia
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is set to reduce', () => {
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current).toBe(true);
  });

  it('updates when prefers-reduced-motion changes', () => {
    let matchMediaListeners = [];
    
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn((event, handler) => {
        matchMediaListeners.push({ event, handler });
      }),
      removeEventListener: vi.fn(),
    }));

    const { result, rerender } = renderHook(() => useReducedMotion());
    
    expect(result.current).toBe(false);

    // Simulate user enabling reduced motion
    act(() => {
      const listener = matchMediaListeners.find(l => l.event === 'change');
      if (listener) {
        listener.handler({ matches: true });
      }
    });

    rerender();

    expect(result.current).toBe(true);
  });

  it('removes event listener on cleanup', () => {
    const removeEventListenerMock = vi.fn();
    
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
    }));

    const { unmount } = renderHook(() => useReducedMotion());
    
    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
