import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiError } from './client';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('api.get', () => {
    it('should make a GET request and return data', async () => {
      const mockData = [{ _id: '1', name: 'Test' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.get('/packages');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/packages'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual(mockData);
    });

    it('should throw ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      try {
        await api.get('/packages/999');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).message).toBe('Not found');
      }
    });
  });

  describe('api.post', () => {
    it('should make a POST request with body', async () => {
      const newPackage = { packageName: 'Test', price: 100, expenses: {} };
      const mockResponse = { _id: '1', ...newPackage };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.post('/packages', newPackage);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/packages'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newPackage),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('api.put', () => {
    it('should make a PUT request with body', async () => {
      const updateData = { packageName: 'Updated', price: 200, expenses: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ _id: '1', ...updateData }),
      });

      const result = await api.put('/packages/1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/packages/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        }),
      );
      expect(result).toHaveProperty('packageName', 'Updated');
    });
  });

  describe('api.patch', () => {
    it('should make a PATCH request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ _id: '1', isActive: false }),
      });

      const result = await api.patch('/teachers/1/deactivate');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teachers/1/deactivate'),
        expect.objectContaining({ method: 'PATCH' }),
      );
      expect(result).toHaveProperty('isActive', false);
    });

    it('should include body when data is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await api.patch('/test', { key: 'value' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ key: 'value' }),
        }),
      );
    });
  });

  describe('api.delete', () => {
    it('should make a DELETE request and return null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(null),
      });

      const result = await api.delete('/packages/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/packages/1'),
        expect.objectContaining({ method: 'DELETE' }),
      );
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle non-JSON error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Not JSON')),
      });

      await expect(api.get('/fail')).rejects.toThrow('Request failed');
    });
  });
});
