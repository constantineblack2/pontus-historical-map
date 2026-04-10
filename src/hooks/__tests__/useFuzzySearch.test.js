import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFuzzySearch } from '../useFuzzySearch';

const cities = [
  { id: 1, name: 'Τραπεζούντα', region: 'Πόντος' },
  { id: 2, name: 'Σινώπη', region: 'Πόντος' },
  { id: 3, name: 'Σμύρνη', region: 'Ιωνία' },
];
const getSearchText = (item) => `${item.name} ${item.region}`;

describe('useFuzzySearch', () => {
  it('returns all items when search term is empty', () => {
    const { result } = renderHook(() => useFuzzySearch(cities, getSearchText));
    expect(result.current.results).toEqual(cities);
  });

  it('returns all items when search term is only whitespace', () => {
    const { result } = renderHook(() => useFuzzySearch(cities, getSearchText));
    act(() => { result.current.setSearchTerm('   '); });
    expect(result.current.results).toEqual(cities);
  });

  it('filters by exact match', () => {
    const { result } = renderHook(() => useFuzzySearch(cities, getSearchText));
    act(() => { result.current.setSearchTerm('Σμύρνη'); });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('Σμύρνη');
  });

  it('performs fuzzy matching — characters must appear in order', () => {
    const items = [{ name: 'Trabzon' }, { name: 'Sinope' }];
    const getText = (item) => item.name;
    const { result } = renderHook(() => useFuzzySearch(items, getText));

    act(() => { result.current.setSearchTerm('tzn'); }); // T...z...n — in order
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('Trabzon');

    act(() => { result.current.setSearchTerm('nzt'); }); // reversed — no match
    expect(result.current.results).toHaveLength(0);
  });

  it('is case insensitive', () => {
    const { result } = renderHook(() => useFuzzySearch(cities, getSearchText));
    act(() => { result.current.setSearchTerm('σμ'); }); // lowercase for Σμύρνη
    expect(result.current.results.some((c) => c.name === 'Σμύρνη')).toBe(true);
  });

  it('returns empty array when nothing matches', () => {
    const { result } = renderHook(() => useFuzzySearch(cities, getSearchText));
    act(() => { result.current.setSearchTerm('xxxxxxxx'); });
    expect(result.current.results).toHaveLength(0);
  });

  // Bug 4: LeftSidebar passed `(city) => ...` inline, creating a new function reference
  // every render. This caused useMemo to recompute on every render even without any
  // search change. Fixed by wrapping the function in useCallback.
  it('does not recompute results when getSearchText reference is stable', () => {
    const stableGetSearchText = vi.fn((item) => item.name);

    const { result, rerender } = renderHook(
      ({ fn }) => useFuzzySearch(cities, fn),
      { initialProps: { fn: stableGetSearchText } }
    );

    act(() => { result.current.setSearchTerm('σμ'); });

    const callCountAfterSearch = stableGetSearchText.mock.calls.length;
    const resultsRef = result.current.results;

    // Re-render with the same function reference (stable, as useCallback produces)
    rerender({ fn: stableGetSearchText });

    expect(result.current.results).toBe(resultsRef);         // same object = memo hit
    expect(stableGetSearchText.mock.calls.length).toBe(callCountAfterSearch); // not called again
  });

  it('recomputes results when getSearchText reference changes (the bug without useCallback)', () => {
    const { result, rerender } = renderHook(
      ({ fn }) => useFuzzySearch(cities, fn),
      { initialProps: { fn: (item) => item.name } }
    );

    act(() => { result.current.setSearchTerm('σμ'); });

    // Re-render with a new reference (what an inline arrow function causes every render)
    const newFn = vi.fn((item) => item.name);
    rerender({ fn: newFn });

    // useMemo re-ran because the dependency reference changed
    expect(newFn.mock.calls.length).toBeGreaterThan(0);
  });
});
