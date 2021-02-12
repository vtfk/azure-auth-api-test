export const APP = {
  IS_MOCK: process.env.REACT_APP_IS_MOCK || false
}

export const ROUTES = {
  HELP: 'help'
}

export const AUTH = {
  CONF: {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID,
      authority: process.env.REACT_APP_AUTHORITY,
      redirectUri: process.env.REACT_APP_REDIRECT_URL,
      postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_URL
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true
    }
  },
  LOGIN_REQUEST: {
    scopes: ['openid', 'profile', 'User.Read'],
    forceRefresh: true
  },
  API_REQUEST: {
    scopes: ['openid', 'profile', 'User.Read'],
    forceRefresh: false
  },
  GRAPH: {
    userInfoUrl: process.env.USER_INFO_URL || 'https://graph.microsoft.com/v1.0/me?$select=userPrincipalName,onPremisesSamaccountName,givenName,surname,displayName'
  }
}
