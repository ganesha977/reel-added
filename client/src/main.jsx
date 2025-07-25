import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import  './App.css'

import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/Store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'




//store persistor
const persistor = persistStore(store);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <App />


    </PersistGate>

    </Provider>

    <Toaster/>

  </StrictMode>
)
