import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSession } from '@vtfk/react-msal'
import { ROUTES, AUTH, APP } from './config'

import { Home } from './pages/Home'
import { Help } from './pages/Help'
import { PageNotFound } from './pages/PageNotFound'

const AppContent = () => {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path={`/${ROUTES.HELP}`} element={<Help />} />

          <Route exact path='*' element={<PageNotFound />} />
        </Routes>

      </div>
    </Router>
  )
}

export const App = () => {
  const { isAuthenticated, login, authStatus } = useSession()

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
