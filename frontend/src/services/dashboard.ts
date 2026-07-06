const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const dashboardApi = {
  getSummary: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch summary');
    return (await res.json()).data;
  },
  getCustomerTrend: async (accessToken: string, interval: 'day'|'week'|'month' = 'day') => {
    const res = await fetch(`${API_BASE_URL}/dashboard/customers/trend?interval=${interval}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch customer trend');
    return (await res.json()).data;
  },
  getOnuStatusCounts: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/onus/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch ONU status');
    return (await res.json()).data;
  },
  getAlarmTrend: async (accessToken: string, interval: '24h'|'7d'|'30d' = '24h') => {
    const res = await fetch(`${API_BASE_URL}/dashboard/alarms/trend?interval=${interval}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch alarm trend');
    return (await res.json()).data;
  },
  getOnuByVendor: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/onus/vendor`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch ONU by vendor');
    return (await res.json()).data;
  },
  getOpticalDistribution: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/onus/optical-power-distribution`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch optical distribution');
    return (await res.json()).data;
  },
  getLatestWorkflows: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/workflows/latest?limit=5`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch latest workflows');
    return (await res.json()).data;
  },
  getLatestAlarms: async (accessToken: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/alarms/latest?limit=5`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch latest alarms');
    return (await res.json()).data;
  }
};
