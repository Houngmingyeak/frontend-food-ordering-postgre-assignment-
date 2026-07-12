export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:8080/uploads';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];
