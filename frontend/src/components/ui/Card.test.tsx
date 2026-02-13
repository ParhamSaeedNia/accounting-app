import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card, { CardHeader, CardContent } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('applies gradient styles when gradient prop is true', () => {
    const { container } = render(<Card gradient>Content</Card>);
    expect((container.firstChild as HTMLElement).className).toContain(
      'bg-gradient-to-br',
    );
  });

  it('does not apply gradient by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect((container.firstChild as HTMLElement).className).not.toContain(
      'bg-gradient-to-br',
    );
  });
});

describe('CardHeader', () => {
  it('renders title', () => {
    render(<CardHeader title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<CardHeader title="Title" subtitle="My Subtitle" />);
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<CardHeader title="Title" />);
    expect(container.querySelectorAll('p').length).toBe(0);
  });

  it('renders action element when provided', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Inner content</CardContent>);
    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CardContent className="extra">Content</CardContent>,
    );
    expect(container.firstChild).toHaveClass('extra');
  });
});
