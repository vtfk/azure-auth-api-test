import { rest } from 'msw'
import { APP } from '../config'

export const generateResponseObject = (response) => {
  return {
    data: response,
    count: response.length || undefined
  }
}

export const generateErrorObject = (statusCode, message, innerError) => {
  return {
    error: {
      statusCode: statusCode || 500,
      message: message || 'Unexpected error occured!',
      innerError
    }
  }
}

export const handlers = [
  rest.get(`${APP.API_URL}/:query`, (req, res, ctx) => {
    const { query } = req.params

    return res(
      ctx.status(200),
      ctx.json(query)
    )
  })
]
