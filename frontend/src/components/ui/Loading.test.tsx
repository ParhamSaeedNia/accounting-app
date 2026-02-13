import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading, { PageLoading } from './Loading';

describe('Loading', () => {
  it('renders default loading message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading message', () => {
    render(<Loading message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('renders spinner', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});

describe('PageLoading', () => {
  it('renders Loading component inside page layout', () => {
    render(<PageLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
