import { Navigate, type RouteObject } from 'react-router-dom';
import AppealPage from '@/pages/AppealPage';
import ClusterPage from '@/pages/ClusterPage';
import AnalysisPage from '@/pages/AnalysisPage';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label?: string;
  icon?: string;
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/appeals" replace />,
  },
  {
    path: '/appeals',
    element: <AppealPage />,
  },
  {
    path: '/clusters',
    element: <ClusterPage />,
  },
  {
    path: '/analysis',
    element: <AnalysisPage />,
  },
  {
    path: '*',
    element: <Navigate to="/appeals" replace />,
  },
];

export interface MenuItemConfig {
  path: string;
  label: string;
  icon: string;
}

export const menuItems: MenuItemConfig[] = [
  {
    path: '/appeals',
    label: '诉求汇入',
    icon: 'Inbox',
  },
  {
    path: '/clusters',
    label: '聚类看板',
    icon: 'LayoutDashboard',
  },
  {
    path: '/analysis',
    label: '研判记录',
    icon: 'FileCheck',
  },
];

export default routes;
