import * as React from 'react';

import * as ReactDOM from 'react-dom/client';

import App from './App';

import { isProduction } from '@/configs';
import reportWebVitals from '@/libs/utils/web-vitals';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (isProduction) {
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
