import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { oltApi } from '../services/olt';

const OltDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuthStore();

  const {
    data: olt,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['olt', id],
    queryFn: () => {
      if (!id || !accessToken) throw new Error('OLT ID or Access Token missing');
      return oltApi.getOltById(id, accessToken);
    },
    enabled: !!id && !!accessToken,
  });

  const testConnectionMutation = useMutation({
    mutationFn: () => {
      if (!olt || !accessToken) throw new Error('Missing data');
      return oltApi.testConnection(olt.ipAddress, olt.port.toString(), accessToken);
    },
  });

  if (isLoading) return <div className="p-6 text-gray-700 dark:text-gray-300">Loading OLT details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;
  if (!olt) return <div className="p-6 text-gray-700 dark:text-gray-300">OLT not found.</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          OLT Details: {olt.name}
        </h1>
        <button
          onClick={() => testConnectionMutation.mutate()}
          disabled={testConnectionMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testConnectionMutation.isPending ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {testConnectionMutation.isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Connection Successful!</div>
      )}
      {testConnectionMutation.isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Connection Failed: {testConnectionMutation.error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <p><strong>Name:</strong> {olt.name}</p>
          <p><strong>Vendor:</strong> {olt.vendor}</p>
          <p><strong>Model:</strong> {olt.model || 'N/A'}</p>
          <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs text-white ${olt.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>{olt.status}</span></p>
        </div>
        <div>
          <p><strong>IP Address:</strong> {olt.ipAddress}</p>
          <p><strong>Port:</strong> {olt.port}</p>
          <p><strong>Transport:</strong> {olt.transport}</p>
          <p><strong>Username:</strong> {olt.username}</p>
          <p className="text-sm italic text-gray-500 mt-2">* Password is encrypted and hidden</p>
        </div>
      </div>
    </div>
  );
};

export default OltDetailPage;