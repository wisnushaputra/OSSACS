import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '../../services/operational/workflow';
import { useAuthStore } from '../../store/authStore';

export default function WorkflowHistoryPage() {
  const { token } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const { limit, offset } = useState({ limit: 10, offset: 0 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['workflow-history', id, pagination],
    queryFn: () => workflowApi.getWorkflowHistory(id, token!, { limit, offset }),
    staleTime: 60000,
  });

  const { data: workflows, total } = data || {};

  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Workflow History</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label>
            Show per page:
            <select 
              value={pagination.limit}
              onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
            >
              <option value={10}>10</option>
              <option value={20} selected>20</option>
              <option value={50} selected>50</option>
              <option value={100} selected>100</option>
            </select>
          </div>
          <button 
            onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + pagination.limit }))}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        </div>

        <DataTable
          columns={[
            { header: 'Workflow ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Status', key: 'status' },
            { header: 'Created', key: 'createdAt' },
            { header: 'Actions', key: 'actions' }
          ] 
          data={data?.data || []}
          total={data?.total || 0}
          limit={pagination.limit}
          offset={pagination.offset}
          onPageChange={(page) => setPagination({ ...pagination, offset: (page - 1) * pagination.limit })}
        }
      />
    </div>
  );
}

export default WorkflowHistoryPage;