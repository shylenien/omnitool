import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ToolPage } from './pages/ToolPage';

export const App: React.FC = () => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';

  return (
    <BrowserRouter basename={baseUrl}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":categoryId" element={<CategoryPage />} />
          <Route path=":categoryId/:slug" element={<ToolPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
