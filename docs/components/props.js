import React from 'react'
import './props.css'
const Props = () => {
  return (
    <div className='OuterContainer'>
      <table>
        <tbody>
          <tr>
            <th>Name of the Prop</th>
            <th>Type of the prop</th>
            <th>Default</th>
            <th>Usage</th>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-1'>options</a>
            </td>
            <td>Array</td>
            <td />
            <td>Renders options in the combo box</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-1'>placeholder</a>
            </td>
            <td>String</td>
            <td />
            <td>Sets the placeholder for the combo box</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-1'>defaultIndex</a>
            </td>
            <td>number</td>
            <td>-1</td>
            <td>Sets the default value for the given index.</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-2'>focusColor</a>
            </td>
            <td>String</td>
            <td>#9b9b9b</td>
            <td>Changes the highlighted colour of the selected option</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-2'>className</a>
            </td>
            <td>String</td>
            <td />
            <td>
              Class-name for the component. Use this to style the component in
              the css file.
            </td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-3'>onChange</a>
            </td>
            <td>Function</td>
            <td />
            <td>Invoked every time the user changes the input's value.</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-3'>onSelect</a>
            </td>
            <td>Function</td>
            <td />
            <td>
              Invoked when the user selects any option from the list of options.
            </td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-3'>onOptionsChange</a>
            </td>
            <td>Function</td>
            <td />
            <td>Invoked when the options are changed using down or up key.</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-4'>optionsListMaxHeight</a>
            </td>
            <td>number</td>
            <td>200</td>
            <td>Sets the maximum height of the options list container.</td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-4'>renderOptions</a>
            </td>
            <td>Function</td>
            <td />
            <td>
              This is a callback function which is used to render the options as
              you wish. Checkout the example how to use this prop.
            </td>
          </tr>
          <tr>
            <td>
              <a href='/docs-props/#example-4'>enableAutocomplete</a>
            </td>
            <td>Boolean</td>
            <td>false </td>
            <td>Enables the autocomplete feature in the combo box.</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Props
