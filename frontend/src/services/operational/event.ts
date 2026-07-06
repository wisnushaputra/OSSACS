const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const eventApi = {
  getEvents: async (accessToken: string, params?: { 
    limit?: number; 
    offset?: number; 
    customerId?: string; 
    onuId?: string; 
    oltId?: string; 
    workflowId?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    if (params?.onuId) queryParams.append('onuId', params.onuId);
    if (params?.oltId) queryParams.append('oltId', params.oltId);
    if (params?.workflowId) queryParams.append('workflowId', params.workflowId);
    if (params?.eventType) queryParams.append('eventType', params.eventType);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_BASE_URL}/events?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch events');
    }

    const data = await response.json();
    return data.data;
  },
};
