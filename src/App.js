import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSession } from '@vtfk/react-msal'
import { ROUTES, AUTH, APP } from './config'

import { Home } from './pages/Home'
import { Help } from './pages/Help'
import { PageNotFound } from './pages/PageNotFound'

const AppContent = () => {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path={`/${ROUTES.HELP}`} component={Help} />

          <Route exact path='*' component={PageNotFound} />
        </Switch>

      </div>
    </Router>
  )
}

export const App = () => {
  const { isAuthenticated, login, authStatus, user } = useSession()

  if (['pending'].includes(authStatus)) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    login(AUTH.LOGIN_REQUEST)
    return <></>
  }

  if (isAuthenticated && authStatus === 'finished') {
    return <AppContent />
  } else if (APP.IS_MOCK) {
    return <></>
  }
}
