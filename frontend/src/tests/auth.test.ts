import { test, expect } from 'vitest';
import { useAuthStore } from '../store/auth';

test('AuthStore: login/logout', () => {
  const { login, logout } = useAuthStore.getState();
  
  login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  
  logout();
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
});