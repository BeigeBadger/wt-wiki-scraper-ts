import { describe, it, expect, vi } from 'vitest';
import { ApolloError } from '@apollo/client';
import { handleGqlError } from './toastUtils';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

describe('handleGqlError', () => {
  it('should call toast.error with default message', () => {
    // Arrange
    const mockError = new ApolloError({ errorMessage: 'Network error' });

    // Act
    handleGqlError(mockError);

    // Assert
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong when fetching data',
      expect.any(Object)
    );
  });

  it('should call toast.error with custom message', () => {
    // Arrange
    const mockError = new ApolloError({ errorMessage: 'Network error' });

    // Act
    handleGqlError(mockError, 'Custom error message');

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Custom error message', expect.any(Object));
  });

  it('should log error type and details to console when logToConsole is true', () => {
    // Arrange
    const mockError = new ApolloError({ errorMessage: 'Network error' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    handleGqlError(mockError, 'Error', true);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Error type:', 'ApolloError');
    expect(consoleSpy).toHaveBeenCalledWith('Error details:', mockError);
    consoleSpy.mockRestore();
  });

  it('should not log to console when logToConsole is false', () => {
    // Arrange
    const mockError = new ApolloError({ errorMessage: 'Network error' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    handleGqlError(mockError, 'Error', false);

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should pass custom icon to toast', () => {
    // Arrange
    const mockError = new ApolloError({ errorMessage: 'Network error' });

    // Act
    handleGqlError(mockError);

    // Assert
    expect(toast.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        icon: expect.any(Object),
      })
    );
  });
});
