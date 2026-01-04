import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

import routes from './routes';

import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <UserPreferencesProvider>
        <IntersectObserver />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </UserPreferencesProvider>
    </Router>
  );
};

export default App;
