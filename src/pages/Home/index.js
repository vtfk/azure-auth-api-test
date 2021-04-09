import { Heading2, TextField, Button, RadioButton } from '@vtfk/components'
import React, { useState } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { useSession } from '@vtfk/react-msal'
import { Layout } from '../../layout'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './styles.scss'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

export const Home = () => {
  const { user, apiPost, apiGet } = useSession()
  const [currentApiUrl, setCurrentApiUrl] = useState('')
  const [currentBody, setCurrentBody] = useState('')
  const [currentApiMethod, setCurrentApiMethod] = useState('POST')
  const [showFullResponse, setShowFullResponse] = useState(true)
  const [currentOutput, setCurrentOutput] = useState('{}')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStartDate, setCurrentStartDate] = useState(null)
  const [currentStopDate, setCurrentStopDate] = useState(null)
  const [currentElapsed, setCurrentElapsed] = useState(-1)

  function prettify () {
    const json = JSON.parse(currentBody)
    const jsonStr = JSON.stringify(json, null, 2)

    setCurrentBody(jsonStr)
  }

  function padDate (num) {
    return num >= 10 ? num : `0${num}`
  }

  function prettifyDate (date, skipDate, skipTime) {
    const pretty = `${padDate(date.getDate())}.${padDate(date.getMonth() + 1)}.${date.getFullYear()} ${padDate(date.getHours())}:${padDate(date.getMinutes())}:${padDate(date.getSeconds())}`
    return skipDate && skipTime ? '' : skipDate ? pretty.split(' ')[1] : skipTime ? pretty.split(' ')[0] : pretty
  }

  const send = async () => {
    const startDate = new Date()
    setCurrentStartDate(startDate)
    console.log('send', currentApiMethod, (showFullResponse ? 'full response' : 'data only'), 'start')
    if (currentApiMethod === 'POST' && !currentBody) {
      setCurrentOutput('Body is required for POST')
      console.log('send', currentApiMethod, (showFullResponse ? 'full response' : 'data only'), 'finished')
      setCurrentStopDate(new Date())
      setCurrentElapsed(-1)
      return
    }

    setIsSubmitting(true)
    setCurrentOutput('')

    try {
      const { data, headers, status } = await (currentApiMethod === 'POST' ? apiPost(currentApiUrl, JSON.parse(currentBody), true) : apiGet(currentApiUrl, true))
      console.log('send', currentApiMethod, (showFullResponse ? 'full response' : 'data only'), 'Status:', status, 'Headers:', headers, 'Data:', data)
      if (!data) setCurrentOutput('No body returned for the response.\nOpen Console in Developer Tools for more information')
      else setCurrentOutput(JSON.stringify(showFullResponse ? { status, headers, data } : data, null, 2))
    } catch (error) {
      console.log('send', currentApiMethod, (showFullResponse ? 'full response' : 'data only'), 'Error:', error)
      setCurrentOutput(error.message)
    }

    setIsSubmitting(false)
    const stopDate = new Date()
    const elapsed = (stopDate - startDate) / 1000
    setCurrentStopDate(stopDate)
    setCurrentElapsed(elapsed)
    console.log('send', currentApiMethod, (showFullResponse ? 'full response' : 'data only'), 'finished')
  }

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
        <div className='action-row'>
          <table className='action-table'>
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
                    label='Data only'
                    value='DATA'
                    name='select-data'
                    checked={!showFullResponse}
                    onChange={() => setShowFullResponse(false)}
                  />
                </td>
                <td>
                  <RadioButton
                    label='Full response'
                    value='FULL'
                    name='select-full'
                    checked={showFullResponse}
                    onChange={() => setShowFullResponse(true)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <table className='action-info'>
            <tbody>
              <tr>
                <td>
                  {
                    !!currentStartDate && isSubmitting
                      ? (
                        <>
                          <b>Start:</b> {prettifyDate(currentStartDate)}
                        </>
                        )
                      : !!currentStopDate && !isSubmitting
                          ? (
                            <>
                              <b>Start:</b> {prettifyDate(currentStartDate)}<br />
                              <b>Stop:</b> {prettifyDate(currentStopDate)}<br />
                              <b>Elapsed seconds:</b> {currentElapsed > -1 ? currentElapsed : ((currentStopDate - currentStartDate) / 1000)}
                            </>
                            )
                          : ''
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
        <SyntaxHighlighter language='json' className='code' style={docco}>
          {currentOutput}
        </SyntaxHighlighter>
      </>
    </Layout>
  )
}
