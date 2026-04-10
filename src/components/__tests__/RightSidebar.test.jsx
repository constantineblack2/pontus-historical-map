import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { STORAGE_KEYS } from '../../constants';
import RightSidebar from '../Sidebars/RightSidebar';

// Stub framer-motion so animation state does not interfere with DOM assertions.
// AnimatePresence must always render its children synchronously here so we can
// test mount/unmount transitions without waiting for animation frames.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, style }) => (
      <div className={className} onClick={onClick} style={style}>{children}</div>
    ),
    img: ({ src, alt, onClick, style, className, onError }) => (
      <img src={src} alt={alt} onClick={onClick} style={style} className={className} onError={onError} />
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockCity = {
  id: 'trapezunta',
  name: 'Τραπεζούντα',
  region: 'Πόντος',
  established: '756 π.Χ.',
  population: '~350,000 (1914)',
  description: 'Μια σπουδαία πόλη.',
  longDescription: 'Μεγάλη ιστορία.',
  images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
  coordinates: [40.98, 39.71],
};

const defaultProps = {
  showMoreImages: false,
  onClose: vi.fn(),
  onToggleMoreImages: vi.fn(),
  onImageClick: vi.fn(),
};

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe('RightSidebar', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  // Bug 1: the original code had `if (!city) return null` before <AnimatePresence>,
  // which meant the exit animation (x: 400) never fired — the component disappeared
  // instantly. The fix removes that early return so AnimatePresence controls unmounting.
  it('renders no city content when city is null', () => {
    const { container } = render(
      <RightSidebar {...defaultProps} city={null} />,
      { wrapper }
    );
    expect(container.querySelector('.city-details')).toBeNull();
  });

  it('renders city name and description when city is provided', () => {
    render(
      <RightSidebar {...defaultProps} city={mockCity} />,
      { wrapper }
    );
    expect(screen.getByRole('heading', { name: 'Τραπεζούντα' })).toBeInTheDocument();
    expect(screen.getByText('Μια σπουδαία πόλη.')).toBeInTheDocument();
  });

  it('transitions from city to null without crashing', () => {
    const { rerender } = render(
      <ThemeProvider>
        <RightSidebar {...defaultProps} city={mockCity} />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: 'Τραπεζούντα' })).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <RightSidebar {...defaultProps} city={null} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('heading', { name: 'Τραπεζούντα' })).not.toBeInTheDocument();
  });

  it('transitions from null to a city and renders correctly', () => {
    const { rerender } = render(
      <ThemeProvider>
        <RightSidebar {...defaultProps} city={null} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('heading', { name: 'Τραπεζούντα' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <RightSidebar {...defaultProps} city={mockCity} />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: 'Τραπεζούντα' })).toBeInTheDocument();
  });

  // Bug 2: dark mode CSS rules in App.css used `.app.dark .element`, but the `.app`
  // div never received the `dark` class. Fixed by reading isDark in App.jsx and adding
  // `dark` to the root className. This test confirms the pattern works at component level:
  // when ThemeContext has isDark=true, the sidebar carries the dark class that CSS targets.
  it('applies dark class to sidebar when dark mode is active', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(true));

    const { container } = render(
      <RightSidebar {...defaultProps} city={mockCity} />,
      { wrapper }
    );

    expect(container.querySelector('.sidebar')).toHaveClass('dark');
  });

  it('does not apply dark class in light mode', () => {
    const { container } = render(
      <RightSidebar {...defaultProps} city={mockCity} />,
      { wrapper }
    );

    expect(container.querySelector('.sidebar')).not.toHaveClass('dark');
  });
});
