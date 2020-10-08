import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'

type ComboBoxProps = {
  data: string[]
  onChange?: Function
  defaultValue?: string
  placeholder?: string
  onSelect?: Function
  onOptionsChange?: Function
  optionsListMaxHeight?: number
  renderOptions?: Function
}

const UP_ARROW = 38
const DOWN_ARROW = 40
const ENTER_KEY = 13
const ESCAPE_KEY = 27

const ExampleComponent: React.FC<ComboBoxProps> = ({
  data,
  onChange,
  defaultValue,
  placeholder,
  onSelect,
  onOptionsChange,
  optionsListMaxHeight,
  renderOptions,
  ...forwardedProps
}) => {
  const suggestions: string[] = data
  const optionMaxHeight = optionsListMaxHeight || 200
  let suggestionListPositionStyles: any = {
    top: '100%',
    marginTop: '5px'
  }

  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const [currentFocus, setCurrentFocus] = useState(-1)

  const suggestionRef = useRef(null)
  const optionRef = useRef(null)
  const inputRef = useRef(null)

  // Determine the position(top or bottom) where the suggestion list to be showed
  const suggestCurrentObject: any = suggestionRef.current

  const suggestionListPosition =
    suggestCurrentObject?.offsetWidth +
    suggestCurrentObject?.offsetParent.offsetTop

  if (suggestionListPosition > window.innerHeight) {
    suggestionListPositionStyles = {
      bottom: '100%',
      marginBottom: '5px'
    }
  }

  const updateValue = (index: number = currentFocus) => {
    if (index !== -1) {
      setInputValue(suggestions[index])
      if (onOptionsChange) onOptionsChange(suggestions[index])
    }
  }

  const selectSuggestionHandler = () => {
    updateValue()
    setIsFocus(false)
    if (onSelect) onSelect(suggestions[currentFocus])
  }

  // close the suggestion list if the user click outside other than input and suggestion-list
  const handleClickOutside = (event: any) => {
    const inputCurrentObject: any = inputRef.current
    const suggestionCurrentObject: any = suggestionRef.current
    if (
      inputCurrentObject &&
      suggestionCurrentObject &&
      !inputCurrentObject.contains(event.target) &&
      !suggestionCurrentObject.contains(event.target)
    ) {
      setIsFocus(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', (event) => handleClickOutside(event))

    return () => {
      document.removeEventListener('mousedown', (event) =>
        handleClickOutside(event)
      )
    }
  })

  const keyHandler = (event: any) => {
    const suggestCurrentObject: any = suggestionRef.current
    const optionCurrentObject: any = optionRef.current

    switch (event.keyCode) {
      case DOWN_ARROW: {
        // set the focus to true if the options list was not opened.
        if (!isFocus) setIsFocus(true)

        // If the focus reaches the end of the suggestions in the list, set the focus to 0
        if (currentFocus >= suggestions.length - 1) {
          setCurrentFocus(0)
          updateValue(0)
          suggestCurrentObject.scrollTop = 0
        }
        // Change the scroll position based on the selected option position
        else {
          setCurrentFocus(currentFocus + 1)
          updateValue(currentFocus + 1)
          if (optionCurrentObject && suggestCurrentObject) {
            suggestCurrentObject.scrollTop = optionCurrentObject.offsetTop
          }
        }
        suggestionRef.current = suggestCurrentObject
        break
      }
      case UP_ARROW: {
        // If the focus falls beyond the start of the suggestions in the list, set the focus to height of the suggestion-list
        if (currentFocus <= 0) {
          setCurrentFocus(suggestions.length - 1)
          updateValue(suggestions.length - 1)

          if (suggestCurrentObject) suggestCurrentObject.scrollTop = 10000
        }
        // Change the scroll position based on the selected option position
        else {
          setCurrentFocus(currentFocus - 1)
          updateValue(currentFocus - 1)

          if (optionCurrentObject && suggestCurrentObject)
            suggestCurrentObject.scrollTop = optionCurrentObject.offsetTop - 30
        }
        suggestionRef.current = suggestCurrentObject
        break
      }
      case ENTER_KEY: {
        if (currentFocus > -1 && currentFocus < suggestions.length)
          selectSuggestionHandler()

        break
      }
      case ESCAPE_KEY: {
        event.target.blur()
        setIsFocus(false)
        break
      }
    }
  }

  const suggestionClickHandler = (event: any) => {
    event.stopPropagation()
    selectSuggestionHandler()
  }

  const inputChangeHandler = (event: any) => {
    if (onChange) onChange(event)
    setInputValue(event.target.value)
  }

  return (
    <div className={styles.comboBox} {...forwardedProps}>
      <input
        onFocus={() => setIsFocus(true)}
        onChange={inputChangeHandler}
        onClick={(event: any) => {
          event.stopPropagation()
        }}
        ref={inputRef}
        autoComplete='off'
        placeholder={placeholder || ''}
        onKeyDown={keyHandler}
        value={inputValue}
        className={styles.comboBoxInput}
      />

      <div
        className={styles.comboBoxPopover}
        style={{
          opacity: isFocus ? 1 : 0,
          visibility: isFocus ? 'visible' : 'hidden',
          ...suggestionListPositionStyles
        }}
        ref={suggestionRef}
      >
        <div
          className={styles.comboBoxList}
          style={{ maxHeight: isFocus ? optionMaxHeight : 0 }}
        >
          {data.map((value, index) => {
            return (
              <div
                className={styles.comboBoxOption}
                key={value}
                ref={index === currentFocus ? optionRef : null}
                style={{
                  backgroundColor:
                    index === currentFocus ? 'rgba(155,155,155,0.15)' : 'white'
                }}
                onClick={suggestionClickHandler}
                onMouseEnter={() => setCurrentFocus(index)}
              >
                {renderOptions ? renderOptions(value) : value}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ExampleComponent
