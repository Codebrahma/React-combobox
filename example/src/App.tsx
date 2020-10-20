import React, { useState } from 'react'

import ComboBox from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'
import './app.css'

import CodebrahmaLogo from './images/codebrahma1.png'
import GithubLogo from './images/github.svg'
import DocsLogo from './images/docs2.png'

const App = () => {
  const [selectedOption, setSelectedOption] = useState('')
  const [highlightedOption, setHighlightedOption] = useState('')
  const [defaultValue, setDefaultValue] = useState('India')
  const data = [
    'America',
    'India',
    'Australia',
    'Argentina',
    'Ireland',
    'Indonesia',
    'Iceland',
    'Japan',
    'China',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua',
    'Barbuda',
    'Mexico',
    'Monaco',
    'Nepal',
    'Bulgaria',
    'Pakistan',
    'Russia',
    'Egypt',
    'Sri Lanka',
    'Singapore'
  ]
  return (
    <div className='outerContainer'>
      <div className='header'>
        <img
          src={CodebrahmaLogo}
          alt='codebrahma-logo'
          className='codebrahma-logo'
        />
        <h2 className='title'>React Combo Box</h2>
        <div>
          <a href='https://github.com/Codebrahma/React-combobox'>
            <img
              src={GithubLogo}
              alt='github-logo'
              className='logo'
              title='github'
            />
          </a>
          <img
            src={DocsLogo}
            alt='docs-logo'
            className='logo'
            title='documentation'
          />
        </div>
      </div>
      <div className='combo-box-container'>
        <p>
          The selected option -{' '}
          <span style={{ fontWeight: 'bold' }}>
            {' '}
            {selectedOption.length > 0 ? selectedOption : 'None'}
          </span>
        </p>
        <p>
          The highlighted option -{' '}
          <span style={{ fontWeight: 'bold' }}>
            {' '}
            {highlightedOption.length > 0 ? highlightedOption : 'None'}
          </span>
        </p>
        <button
          onClick={() =>
            setDefaultValue(data[Math.floor(Math.random() * 15) + 1])
          }
        >
          Click
        </button>
        <ComboBox
          options={data}
          placeholder='choose country'
          optionsListMaxHeight={300}
          style={{
            width: '350px',
            marginTop: '50px'
          }}
          focusColor='#20C374'
          renderOptions={(option: string) => (
            <div className='comboBoxOption'>{option}</div>
          )}
          onSelect={(option) => setSelectedOption(option)}
          onOptionsChange={(option) => setHighlightedOption(option)}
          onBlur={(event) => console.log(event?.target.value)}
          defaultValue={defaultValue}
        />
        <ComboBox
          options={data}
          placeholder='choose country'
          optionsListMaxHeight={300}
          style={{
            width: '350px',
            marginTop: '50px'
          }}
          focusColor='#20C374'
          renderOptions={(option: string) => (
            <div className='comboBoxOption'>{option}</div>
          )}
          onSelect={(option) => setSelectedOption(option)}
          onOptionsChange={(option) => setHighlightedOption(option)}
          enableAutocomplete
          onBlur={(event) => console.log(event?.target.value)}
          editable={false}
        />
      </div>
      <p style={{ marginTop: '800px' }}>Hello world</p>
    </div>
  )
}

export default App
