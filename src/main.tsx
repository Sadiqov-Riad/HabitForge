import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './app/App.tsx';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { LanguageProvider } from '@/shared/i18n/LanguageProvider';
createRoot(document.getElementById('root')!).render(<StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" toastOptions={{
        style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
        },
    }}/>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>);
