import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-dark-700');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('text-emerald-400');
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toContain('text-amber-400');
  });

  it('applies danger variant styles', () => {
    render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger').className).toContain('text-rose-400');
  });

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('text-indigo-400');
  });

  it('applies income variant styles', () => {
    render(<Badge variant="income">Income</Badge>);
    expect(screen.getByText('Income').className).toContain('text-emerald-400');
  });

  it('applies expense variant styles', () => {
    render(<Badge variant="expense">Expense</Badge>);
    expect(screen.getByText('Expense').className).toContain('text-rose-400');
  });

  it('renders as a span element', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag').tagName).toBe('SPAN');
  });
});
