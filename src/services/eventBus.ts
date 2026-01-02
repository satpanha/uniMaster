// Simple event bus helper using Window CustomEvent
export const DASHBOARD_REFRESH_EVENT = 'dashboard:refresh';

export function emitDashboardRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DASHBOARD_REFRESH_EVENT));
  }
}

export function subscribeToDashboardRefresh(handler: () => void) {
  if (typeof window !== 'undefined') {
    const listener = () => handler();
    window.addEventListener(DASHBOARD_REFRESH_EVENT, listener as EventListener);
    return () => window.removeEventListener(DASHBOARD_REFRESH_EVENT, listener as EventListener);
  }
  return () => {};
}

// Alias for backward compatibility
export const onDashboardRefresh = subscribeToDashboardRefresh;
