import React from 'react';
import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import './app/layout/style.css';
import App from './app/layout/App';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css'
import reportWebVitals from './reportWebVitals';
import { StoreContext, store } from './app/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Route';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>   <App /> --> routerProvider
   <StoreContext.Provider value={store}>
     <RouterProvider router={router} />
   </StoreContext.Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
