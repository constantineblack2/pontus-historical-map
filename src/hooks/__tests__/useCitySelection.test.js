import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCitySelection } from '../useCitySelection';

describe('useCitySelection', () => {
  it('initializes with null selectedCity and empty flyToCoords', () => {
    const { result } = renderHook(() => useCitySelection());
    
    expect(result.current.selectedCity).toBeNull();
    expect(result.current.flyToCoords).toBeNull();
    expect(result.current.showMoreImages).toBe(false);
  });

  it('selects a city and updates flyToCoords', () => {
    const { result } = renderHook(() => useCitySelection());
    const mockCity = {
      id: 1,
      name: 'Test City',
      coordinates: [40.0, 35.0],
      images: ['img1.jpg', 'img2.jpg'],
    };

    act(() => {
      result.current.selectCity(mockCity);
    });

    expect(result.current.selectedCity).toEqual(mockCity);
    expect(result.current.flyToCoords).toEqual([40.0, 35.0]);
    expect(result.current.showMoreImages).toBe(false);
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useCitySelection());
    const mockCity = { id: 1, name: 'Test City', coordinates: [40.0, 35.0] };

    act(() => {
      result.current.selectCity(mockCity);
    });

    expect(result.current.selectedCity).not.toBeNull();

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedCity).toBeNull();
    expect(result.current.showMoreImages).toBe(false);
  });

  it('toggles more images state', () => {
    const { result } = renderHook(() => useCitySelection());

    expect(result.current.showMoreImages).toBe(false);

    act(() => {
      result.current.toggleMoreImages();
    });

    expect(result.current.showMoreImages).toBe(true);

    act(() => {
      result.current.toggleMoreImages();
    });

    expect(result.current.showMoreImages).toBe(false);
  });

  it('resets showMoreImages when selecting a new city', () => {
    const { result } = renderHook(() => useCitySelection());
    const city1 = { id: 1, name: 'City 1', coordinates: [40.0, 35.0] };
    const city2 = { id: 2, name: 'City 2', coordinates: [41.0, 36.0] };

    act(() => {
      result.current.selectCity(city1);
      result.current.toggleMoreImages();
    });

    expect(result.current.showMoreImages).toBe(true);

    act(() => {
      result.current.selectCity(city2);
    });

    expect(result.current.selectedCity.id).toBe(2);
    expect(result.current.showMoreImages).toBe(false);
  });
});
