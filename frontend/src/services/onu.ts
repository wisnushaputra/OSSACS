const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const onuApi = {
  getOnuById: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/onus/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch ONU');
    }

    const data = await response.json();
    return data.data;
  },

  getOnus: async (accessToken: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/onus?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch ONUs');
    }

    const data = await response.json();
    return data.data;
  },

  searchOnus: async (accessToken: string, params: { q: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', params.q);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/onus/search?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to search ONUs');
    }

    const data = await response.json();
    return data.data;
  },

  createOnu: async (onuData: Record<string, any>, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/onus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(onuData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create ONU');
    }

    const data = await response.json();
    return data.data;
  },

  updateOnu: async (id: string, onuData: Record<string, any>, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/onus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(onuData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update ONU');
    }

    const data = await response.json();
    return data.data;
  },

  deleteOnu: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/onus/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete ONU');
    }

    const data = await response.json();
    return data.data;
  },
};
