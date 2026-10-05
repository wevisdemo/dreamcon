import { createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';

export const getRouter = () =>
  createRouter({ routeTree, scrollRestoration: true });
