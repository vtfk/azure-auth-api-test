import React from 'react'
import ReactDOM from 'react-dom'

import { MsalProvider } from '@vtfk/react-msal'
import { BaseStyle } from '@vtfk/components'

import { App } from './App'
import { APP, AUTH } from './config'

if (APP.IS_MOCK) {
  const { worker } = require('./mocks/browser')
  worker.start()
}

ReactDOM.render(
  <React.StrictMode>
    <BaseStyle>
      <MsalProvider config={AUTH.CONF} scopes={AUTH.LOGIN_REQUEST}>
        <App />
      </MsalProvider>
    </BaseStyle>
  </React.StrictMode>,
  document.getElementById('root')
)
