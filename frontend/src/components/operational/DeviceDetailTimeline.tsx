import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { opticalHistoryApi } from '../../services/operational/opticalHistory';
import { useAuthStore } from '../../store/authStore';

const DeviceDetailTimeline = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['optical-history', id],
    queryFn: () => opticalHistoryApi.getHistory(id!, token!),
    enabled: !!id && !!token,
  });

  if (isLoading) return <div>Loading timeline...</div>;
  if (error) return <div>Error loading timeline</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Optical History Timeline</h2>
      <div className="space-y-4">
        {data?.data.map((item: any) => (
          <div key={item.id} className="border p-4 rounded shadow-sm">
            <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>RX Power:</strong> {item.rxPower} dBm</p>
            <p><strong>TX Power:</strong> {item.txPower} dBm</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceDetailTimeline;
