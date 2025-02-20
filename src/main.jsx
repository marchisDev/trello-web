import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import App from '~/App.jsx'
import theme from '~/theme'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// redux
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// cau hinh MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'

// config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cau hinh Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

const persistor = persistStore(store)

// Ki thuat Inject Store: la ki thuat khi can su dung bien redux store o cac file ngoai pham vi component
import { injectStore } from '~/utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { color: 'error', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' },
              buttonOrder: ['confirm', 'cancel']
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
