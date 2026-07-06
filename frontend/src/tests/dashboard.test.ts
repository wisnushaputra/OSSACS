import { test, expect } from 'vitest';
import { useAuthStore } from '../store/auth';

test('AuthStore dashboard initialization checks', () => {
  const state = useAuthStore.getState();
  expect(state.accessToken).toBeDefined();
});
