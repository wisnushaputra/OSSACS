const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const oltApi = {
  getOltById: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/olts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch OLT');
    }

    const data = await response.json();
    return data.data;
  },
  
  testConnection: async (ipAddress: string, port: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/olts/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ipAddress, port }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Connection failed');
    }

    return data;
  },

  getOlts: async (accessToken: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/olts?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch OLTs');
    }

    const data = await response.json();
    return data.data;
  },

  createOlt: async (oltData: Record<string, any>, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/olts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(oltData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create OLT');
    }

    const data = await response.json();
    return data.data;
  },

  updateOlt: async (id: string, oltData: Record<string, any>, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/olts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(oltData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update OLT');
    }

    const data = await response.json();
    return data.data;
  },

  deleteOlt: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/olts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete OLT');
    }

    const data = await response.json();
    return data.data;
  },
};
