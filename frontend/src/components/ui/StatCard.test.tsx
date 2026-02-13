import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Income" value="$10,000" />);
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatCard label="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <StatCard
        label="Income"
        value="$5000"
        icon={<span data-testid="icon">$</span>}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies income variant color', () => {
    render(<StatCard label="Income" value="$5000" variant="income" />);
    const value = screen.getByText('$5000');
    expect(value.className).toContain('text-emerald-400');
  });

  it('applies expense variant color', () => {
    render(<StatCard label="Expenses" value="$2000" variant="expense" />);
    const value = screen.getByText('$2000');
    expect(value.className).toContain('text-rose-400');
  });

  it('applies default variant color', () => {
    render(<StatCard label="Packages" value="5" />);
    const value = screen.getByText('5');
    expect(value.className).toContain('text-white');
  });

  it('renders trend indicator when provided', () => {
    render(<StatCard label="Profit" value="$8000" trend="up" />);
    expect(screen.getByText('vs last period')).toBeInTheDocument();
  });

  it('does not render trend when not provided', () => {
    render(<StatCard label="Profit" value="$8000" />);
    expect(screen.queryByText('vs last period')).not.toBeInTheDocument();
  });
});
