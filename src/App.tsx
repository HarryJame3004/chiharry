import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Learn from '@/pages/Learn';
import Vocabulary from '@/pages/Vocabulary';
import Grammar from '@/pages/Grammar';
import Quiz from '@/pages/Quiz';
import MockTest from '@/pages/MockTest';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import './App.css';

function AppContent() {
  const { isDarkMode, currentPage, updateStreak } = useAppStore();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;

      case 'learn':
        return <Learn />;

      case 'vocabulary':
        return <Vocabulary />;

      case 'grammar':
        return <Grammar />;

      case 'quiz':
        return <Quiz />;

      case 'mock-test':
        return <MockTest />;

      case 'progress':
        return <Progress />;

      case 'settings':
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;