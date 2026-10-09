import { createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';

declare module '@tanstack/react-router' {
  interface HistoryState {
    isFromDashboard?: boolean;
  }
}

export const getRouter = () =>
  createRouter({ routeTree, scrollRestoration: true });
