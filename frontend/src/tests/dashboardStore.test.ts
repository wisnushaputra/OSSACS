import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthStore } from '../store/auth';

describe('AuthStore Dashboard Unit Tests', () => {
  it('initializes with default authentication values', () => {
    // Reset the store before each test to ensure a clean state
    useAuthStore.setState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets authentication state correctly on login', () => {
    // Reset the store before each test to ensure a clean state
    useAuthStore.setState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    const { login } = useAuthStore.getState();
    login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });

    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.accessToken).toBe('token1');
    expect(result.current.user?.username).toBe('test');
  });
});

