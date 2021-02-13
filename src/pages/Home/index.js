import { Heading2, TextField, Button, RadioButton } from '@vtfk/components'
import React, { useState, useEffect } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { useSession } from '@vtfk/react-msal'
import { Layout } from '../../layout'

import highlightjs from 'highlightjs'
import axios from 'axios'

import './styles.scss'
import 'highlightjs/styles/github.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

export const Home = () => {
  const { user, apiPost, apiGet } = useSession()
  const [currentApiUrl, setCurrentApiUrl] = useState('')
  const [currentBody, setCurrentBody] = useState('')
  const [currentApiMethod, setCurrentApiMethod] = useState('POST')
  const [currentApiProvider, setCurrentApiProvider] = useState('MSAL')
  const [currentOutput, setCurrentOutput] = useState('{}')
  const [currentHighlightedOutput, setCurrentHighlightedOutput] = useState('{}')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function prettify () {
    const json = JSON.parse(currentBody)
    const jsonStr = JSON.stringify(json, null, 2)

    setCurrentBody(jsonStr)
  }

  const send = async () => {
    console.log('send', currentApiMethod, currentApiProvider, 'start')
    if (currentApiMethod === 'POST' && !currentBody) {
      setCurrentOutput('Body is required for POST')
      return
    }

    setIsSubmitting(true)
    setCurrentOutput('')

    try {
      const data = currentApiProvider === 'MSAL' ? (currentApiMethod === 'POST' ? await apiPost(currentApiUrl, JSON.parse(currentBody)) : await apiGet(currentApiUrl)) : (currentApiMethod === 'POST' ? await axios.post(currentApiUrl, JSON.parse(currentBody)) : await axios.get(currentApiUrl))
      console.log('send', currentApiMethod, currentApiProvider, 'Data:', data)
      if (!data) setCurrentOutput('No body returned for the response.\nOpen Console in Developer Tools for more information')
      else setCurrentOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      console.log('send', currentApiMethod, currentApiProvider, 'Error:', error)
      setCurrentOutput(error.message)
    }

    setIsSubmitting(false)
    console.log('send', currentApiMethod, currentApiProvider, 'finished')
  }

  useEffect(() => {
    const highlighted = highlightjs.highlightAuto(currentOutput).value
    setCurrentHighlightedOutput(highlighted)
  }, [currentOutput])

  return (
    <Layout className='home'>
      <Heading2 as='h1' className='page-title'>
        {`Hei ${user.givenName} og velkommen til Azure Auth API test`}
      </Heading2>
      <>
        <TextField
          placeholder='API URL'
          onChange={event => setCurrentApiUrl(event.target.value)}
          value={currentApiUrl}
        />
        <table>
          <tbody>
            <tr>
              <td>
                <RadioButton
                  label='GET'
                  value='GET'
                  name='select-get'
                  checked={currentApiMethod === 'GET'}
                  onChange={() => setCurrentApiMethod('GET')}
                />
              </td>
              <td>
                <RadioButton
                  label='POST'
                  value='POST'
                  name='select-post'
                  checked={currentApiMethod === 'POST'}
                  onChange={() => setCurrentApiMethod('POST')}
                />
              </td>
            </tr>
            <tr>
              <td>
                <RadioButton
                  label='MSAL'
                  value='MSAL'
                  name='select-msal'
                  checked={currentApiProvider === 'MSAL'}
                  onChange={() => setCurrentApiProvider('MSAL')}
                />
              </td>
              <td>
                <RadioButton
                  label='AXIOS'
                  value='AXIOS'
                  name='select-axios'
                  checked={currentApiProvider === 'AXIOS'}
                  onChange={() => setCurrentApiProvider('AXIOS')}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <CodeMirror
          className={currentApiMethod === 'GET' ? 'readonly' : undefined}
          options={{
            mode: {
              name: 'javascript',
              json: true,
              statementIndent: 2
            },
            theme: 'material',
            lineNumbers: true,
            lineWrapping: false,
            indentWithTabs: false,
            tabSize: 2,
            smartIndent: true,
            readOnly: currentApiMethod === 'GET'
          }}
          value={currentBody}
          onChange={(editor, data, value) => setCurrentBody(value)}
          autoCursor={false}
        />
        <div className='button-row'>
          <Button
            type='secondary'
            size='small'
            onClick={() => { prettify() }}
          >
            Prettify
          </Button>
          <Button
            type='primary'
            size='small'
            onClick={() => { send() }}
            spinner={isSubmitting}
            disabled={currentApiUrl === ''}
          >
            Send
          </Button>
        </div>
        <pre dangerouslySetInnerHTML={{ __html: currentHighlightedOutput }} />
      </>
    </Layout>
  )
}
