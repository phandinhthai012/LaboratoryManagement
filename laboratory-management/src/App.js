import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotifierProvider } from './contexts/NotifierContext';
function App() {
  return (
    <NotifierProvider>
      <AppRoutes />
    </NotifierProvider>
  );
}

export default App;
