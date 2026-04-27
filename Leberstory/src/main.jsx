import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from "./components/Context/LanguageContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
