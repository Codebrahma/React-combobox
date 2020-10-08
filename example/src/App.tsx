import React from 'react'

import ComboBox from 'reactcombobox'
import 'reactcombobox/dist/index.css'
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
    'Barbuda'
  ]
  return (
    <div>
      <ComboBox
        options={data}
        placeholder='choose country'
        defaultIndex={4}
        optionsListMaxHeight={300}
        style={{ width: '500px' }}
        focusColor='#20C374'
        renderOptions={(option: string) => (
          <div className='comboBoxOption'>{option}</div>
        )}
        enableAutoComplete
      />
      <ComboBox
        options={data}
        placeholder='choose country'
        style={{ marginTop: '600px', marginLeft: '100px' }}
      />
    </div>
  )
}

export default App
