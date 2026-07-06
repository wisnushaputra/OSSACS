const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const alarmApi = {
  getAlarms: async (accessToken: string, params?: { 
    limit?: number; 
    offset?: number; 
    onuId?: string; 
    type?: string; 
    severity?: string; 
    isResolved?: boolean;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.onuId) queryParams.append('onuId', params.onuId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.isResolved !== undefined) queryParams.append('isResolved', params.isResolved.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE_URL}/alarms?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch alarms');
    }

    const data = await response.json();
    return data.data;
  },

  getAlarm: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/alarms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch alarm');
    }

    const data = await response.json();
    return data.data;
  },

  acknowledgeAlarm: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/alarms/${id}/acknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to acknowledge alarm');
    }

    const data = await response.json();
    return data.data;
  },

  resolveAlarm: async (id: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/alarms/${id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to resolve alarm');
    }

    const data = await response.json();
    return data.data;
  },
};
