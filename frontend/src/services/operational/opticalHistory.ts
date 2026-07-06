const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const opticalHistoryApi = {
  getHistory: async (onuId: string, accessToken: string) => {
    const url = `${API_BASE_URL}/optical-history?onuId=${onuId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch optical history');
    }

    const data = await response.json();
    return data.data;
  },
};
