import React from 'react';

type OnuStatus = 'Online' | 'Offline' | 'LOS' | 'Dying Gasp' | 'Disabled' | 'Unknown';

interface StatusBadgeProps {
  status: OnuStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusStyles: Record<OnuStatus, string> = {
  Online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  LOS: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Dying Gasp': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Disabled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Unknown: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const statusIcons: Record<OnuStatus, React.ReactNode> = {
  Online: (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Offline: (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0v-4zm1 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  LOS: (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.99-1.73-.36.55-.862.862-1.194 1.487-.695 1.487.5 0 1.167-.624 1.167-1.487 0-.863-.696-1.486-1.487-1.486H6.826zM8.49 12.75a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  'Dying Gasp': (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.2132-1.73-.36-.55-.862.862-1.194 1.487-.695 1.487.5 0 1.167-.624 1.167-1.487 0-.863-.696-1.486-1.487-1.486H6.826zM8.49 12.75a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  Disabled: (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0v-4zm1 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  Unknown: (
    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-5a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  ),
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const OnuStatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showLabel = true }) => {
  const Icon = statusIcons[status];
  return (
    <span className={`inline-flex items-center ${statusStyles[status]} rounded-full font-medium ${sizeClasses[size]}`}>
      {Icon}
      {showLabel && <span>{status}</span>}
    </span>
  );
};

export const getOnuStatus = (onu: any): OnuStatus => {
  if (onu.deletedAt) {
    return 'Disabled';
  }
  if (onu.status) {
    return onu.status as OnuStatus;
  }
  return 'Unknown';
};

export default OnuStatusBadge;