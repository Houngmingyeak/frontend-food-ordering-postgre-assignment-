import { useToastCtx } from '../components/common';

export function useToast() {
  const ctx = useToastCtx();
  if (!ctx) {
    // Fallback if ToastProvider isn't mounted yet
    return { showToast: (msg) => console.log('[toast]', msg) };
  }
  return ctx;
}
