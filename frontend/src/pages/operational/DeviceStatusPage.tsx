import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { deviceStatusApi } from '../../services/operational/deviceStatus';
import { useAuthStore } from '../../store/authStore';
import DataTable from '../../components/ui/DataTable';

const DeviceStatusPage = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['device-statuses', pagination],
    queryFn: () => deviceStatusApi.getLatestStatuses(token!, pagination),
    enabled: !!token,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading device statuses</div>;

  const columns = [
    { header: 'ONU ID', key: 'onuId' },
    { header: 'Status', key: 'status' },
    { header: 'IP Address', key: 'ipAddress' },
    { header: 'RX Power', key: 'rxPower' },
    { header: 'TX Power', key: 'txPower' },
    { header: 'Actions', key: 'actions', render: (item: any) => <button onClick={() => navigate(`/onus/${item.onuId}/timeline`)}>View Timeline</button> },
  ];


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Device Status</h1>
      <DataTable 
        columns={columns} 
        data={data?.data || []}
        total={data?.total || 0}
        currentPage={Math.floor(pagination.offset / pagination.limit) + 1}
        pageSize={pagination.limit}
        onPageChange={(page) => setPagination({ ...pagination, offset: (page - 1) * pagination.limit })}
      />
    </div>
  );
};

export default DeviceStatusPage;
