import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { onuApi } from '../services/onu';
import { OnuStatusBadge, getOnuStatus } from '../components/ui/OnuStatusBadge';

const OnuDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuthStore();

  const {
    data: onu,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['onu', id],
    queryFn: () => {
      if (!id || !accessToken) throw new Error('ONU ID or Access Token missing');
      return onuApi.getOnuById(id, accessToken);
    },
    enabled: !!id && !!accessToken,
  });

  if (isLoading) return <div className="p-6 text-gray-700 dark:text-gray-300">Loading ONU details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;
  if (!onu) return <div className="p-6 text-gray-700 dark:text-gray-300">ONU not found.</div>;

  const onuStatus = getOnuStatus(onu);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ONU Details: {onu.serialNumber}
        </h1>
        <OnuStatusBadge status={onuStatus} size="lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <p><strong>Serial Number:</strong> {onu.serialNumber}</p>
          <p><strong>Genie Device ID:</strong> {onu.genieDeviceId}</p>
          <p><strong>PON Port:</strong> {onu.ponPort}</p>
          <p><strong>ONU ID:</strong> {onu.onuId}</p>
        </div>
        <div>
          <p><strong>Profile Name:</strong> {onu.profileName}</p>
          <p><strong>VLAN:</strong> {onu.vlan}</p>
          <p><strong>Firmware:</strong> {onu.firmware || 'N/A'}</p>
          <p><strong>Model:</strong> {onu.model || 'N/A'}</p>
          <p><strong>Manufacturer:</strong> {onu.manufacturer || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default OnuDetailPage;