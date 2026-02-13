import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';

const options = [
  { value: '', label: 'Select...' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select label="Type" options={options} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Select error="Required" options={options} />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    const { container } = render(<Select error="Error" options={options} />);
    const select = container.querySelector('select');
    expect(select?.className).toContain('border-rose-500');
  });

  it('fires onChange handler', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Select options={options} onChange={handleChange} />,
    );
    fireEvent.change(container.querySelector('select')!, {
      target: { value: 'income' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={options} />);
    expect(ref).toHaveBeenCalled();
  });
});
