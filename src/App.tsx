import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PointDetailPage } from './pages/PointDetailPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="buscar" element={<SearchPage />} />
          <Route path="pontos/:id" element={<PointDetailPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
  );
}
