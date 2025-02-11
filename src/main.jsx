import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <ConfirmProvider
        defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'error', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' },
          buttonOrder: ['confirm', 'cancel'],
        }}
      >
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-left' theme='colored' />
      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
)
