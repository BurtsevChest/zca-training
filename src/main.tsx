import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Area } from 'ZCA/main';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Area />
  </StrictMode>,
);
