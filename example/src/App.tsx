import React from 'react'

import ComboBox from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'
import './app.css'

const App = () => {
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
    <div style={{ width: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1>React Combo-box</h1>
      <ComboBox
        options={data}
        placeholder='choose country'
        defaultIndex={4}
        optionsListMaxHeight={300}
        style={{
          width: '350px',
          margin: '0 auto',
          marginTop: '50px'
        }}
        focusColor='#20C374'
        renderOptions={(option: string) => (
          <div className='comboBoxOption'>{option}</div>
        )}
        onSelect={(option) => console.log(option)}
        onChange={(event) => console.log(event.target.value)}
        enableAutocomplete
      />
    </div>
  )
}

export default App
