import { createRoot } from 'react-dom/client';
import { Area } from 'ZCA/main';
import { ModalWrapper } from 'react-modal-opener';
import { PrimeReactProvider } from 'primereact/api';
import './index.less';
import "primereact/resources/themes/lara-dark-teal/theme.css";
import Tailwind from 'primereact/passthrough/tailwind';
import 'primeicons/primeicons.css';
import 'react-modal-opener/dist/index.css';
import ru from 'primelocale/ru.json';
import { addLocale, locale } from 'primereact/api';

addLocale('ru', ru.ru);
locale('ru');

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider value={{ pt: Tailwind }}>
    <ModalWrapper/>
    <Area />
  </PrimeReactProvider>,
);
