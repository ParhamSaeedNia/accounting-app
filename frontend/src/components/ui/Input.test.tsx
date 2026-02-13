import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders error message when provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    render(<Input error="Error" placeholder="test" />);
    const input = screen.getByPlaceholderText('test');
    expect(input.className).toContain('border-rose-500');
  });

  it('fires onChange handler', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="type here" />);
    fireEvent.change(screen.getByPlaceholderText('type here'), {
      target: { value: 'hello' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports type prop', () => {
    render(<Input type="password" placeholder="password" />);
    expect(screen.getByPlaceholderText('password')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Input className="my-class" placeholder="test" />);
    expect(screen.getByPlaceholderText('test').className).toContain('my-class');
  });
});
