# azure-auth-api-test

## Setup

1. Clone repo: `git clone git@github.com:vtfk/azure-auth-api-test.git`
1. Copy `env.example` to `.env`
    1. Set `REACT_APP_AUTHORITY` to your tenant id
    1. Set `REACT_APP_CLIENT_ID` to your client id
1. `npm i`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Usage

1. Log in with your Azure AD account.
1. Fill out the `API URL`
1. Choose http method
1. Fill out body if set to `POST`
1. `Prettify` body (just for fun :smirk:)
1. Send

Response will be presented at the bottom :+1:
