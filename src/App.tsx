import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { RequireAuth } from './components/RequireAuth';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PointDetailPage } from './pages/PointDetailPage';
import { SearchPage } from './pages/SearchPage';

const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PointFormPage = lazy(() => import('./pages/PointFormPage'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="buscar" element={<SearchPage />} />
          <Route path="pontos/:id" element={<PointDetailPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/pontos/novo" element={<PointFormPage />} />
            <Route path="admin/pontos/:id" element={<PointFormPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
