import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alarmApi } from '../../services/operational/alarm';
import { useAuthStore } from '../../store/authStore';
import DataTable from '../../components/ui/DataTable';

const AlarmListPage = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const [filters, setFilters] = useState({ type: '', severity: '', isResolved: undefined as boolean | undefined });

  const { data, isLoading, error } = useQuery({
    queryKey: ['alarms', pagination, filters],
    queryFn: () => alarmApi.getAlarms(token!, { ...pagination, ...filters }),
    enabled: !!token,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => alarmApi.acknowledgeAlarm(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alarms'] }),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => alarmApi.resolveAlarm(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alarms'] }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading alarms</div>;

  const columns = [
    { header: 'ONU ID', key: 'onuId' },
    { header: 'Type', key: 'type' },
    { header: 'Severity', key: 'severity' },
    { header: 'Resolved', key: 'resolvedAt', render: (item: any) => item.resolvedAt ? 'Yes' : 'No' },
    { 
      header: 'Actions', 
      key: 'actions', 
      render: (item: any) => (
        <div className="space-x-2">
          {!item.acknowledgedAt && <button onClick={() => acknowledgeMutation.mutate(item.id)} className="text-blue-500">Ack</button>}
          {!item.resolvedAt && <button onClick={() => resolveMutation.mutate(item.id)} className="text-green-500">Resolve</button>}
        </div>
      ) 
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alarm Management</h1>
      <div className="mb-4 space-x-2">
        <select onChange={(e) => setFilters({...filters, type: e.target.value})} className="border p-2">
          <option value="">All Types</option>
          <option value="LOS">LOS</option>
          <option value="POWER_FAILURE">Power Failure</option>
        </select>
      </div>
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

export default AlarmListPage;
