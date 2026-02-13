import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from './Table';

describe('Table components', () => {
  describe('Table', () => {
    it('renders children in a table element', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      );
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });
  });

  describe('TableHeader', () => {
    it('renders as thead', () => {
      const { container } = render(
        <table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>,
      );
      expect(container.querySelector('thead')).toBeInTheDocument();
    });
  });

  describe('TableBody', () => {
    it('renders as tbody', () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>,
      );
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });
  });

  describe('TableRow', () => {
    it('renders children in a row', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <td>Row content</td>
            </TableRow>
          </tbody>
        </table>,
      );
      expect(screen.getByText('Row content')).toBeInTheDocument();
    });

    it('fires onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(
        <table>
          <tbody>
            <TableRow onClick={handleClick}>
              <td>Clickable</td>
            </TableRow>
          </tbody>
        </table>,
      );
      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor-pointer class when onClick is provided', () => {
      render(
        <table>
          <tbody>
            <TableRow onClick={() => {}}>
              <td>Clickable</td>
            </TableRow>
          </tbody>
        </table>,
      );
      const row = screen.getByText('Clickable').closest('tr');
      expect(row?.className).toContain('cursor-pointer');
    });
  });

  describe('TableHead', () => {
    it('renders header cell', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Name</TableHead>
            </tr>
          </thead>
        </table>,
      );
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('TableCell', () => {
    it('renders cell content', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Data</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      expect(screen.getByText('Data')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell className="font-bold">Data</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      expect(screen.getByText('Data').className).toContain('font-bold');
    });
  });

  describe('TableEmpty', () => {
    it('renders default message', () => {
      render(
        <table>
          <tbody>
            <TableEmpty colSpan={3} />
          </tbody>
        </table>,
      );
      expect(screen.getByText('No data found')).toBeInTheDocument();
    });

    it('renders custom message', () => {
      render(
        <table>
          <tbody>
            <TableEmpty message="No packages" colSpan={3} />
          </tbody>
        </table>,
      );
      expect(screen.getByText('No packages')).toBeInTheDocument();
    });
  });
});
