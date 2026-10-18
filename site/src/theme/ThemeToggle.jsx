import { useTheme } from './ThemeContext.jsx';

export default function ThemeToggle() {
  const { toggleTheme, isDark, mounted } = useTheme();

  const dark = mounted ? isDark : false;
  const label = dark ? 'Light mode' : 'Dark mode';
  const icon = dark ? '☀️' : '🌙';
  const ariaLabel = dark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      id="theme-toggle"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={ariaLabel}
    >
      <span className="tt-icon" aria-hidden="true">
        {icon}
      </span>{' '}
      <span className="tt-label">{label}</span>
    </button>
  );
}
