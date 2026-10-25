import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TransactionProvider } from './context/TransactionContext';
import { MainLayout } from './components/layout/MainLayout';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TransactionProvider>
          <MainLayout />
        </TransactionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
