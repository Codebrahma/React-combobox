import React, { useState, useRef, useEffect } from 'react'
import styles from './index.css'

type ComboBoxProps = {
  options: string[]
  onChange?: Function
  defaultValue?: string
  placeholder?: string
  onSelect?: Function
  onOptionsChange?: Function
  optionsListMaxHeight?: number
  renderOptions?: Function
  style?: React.CSSProperties
  className?: string
  focusColor?: string
  enableAutoComplete?: boolean
}

const UP_ARROW = 38
const DOWN_ARROW = 40
const ENTER_KEY = 13
const ESCAPE_KEY = 27

const ExampleComponent: React.FC<ComboBoxProps> = ({
  options: comboBoxOptions,
  onChange,
  defaultValue,
  placeholder,
  onSelect,
  onOptionsChange,
  optionsListMaxHeight,
  renderOptions,
  style,
  className,
  focusColor,
  enableAutoComplete
}) => {
  const optionMaxHeight = optionsListMaxHeight || 200
  let suggestionListPositionStyles: any = {
    top: '100%',
    marginTop: '5px'
  }

  const [options, setOptions] = useState<string[]>(comboBoxOptions)
  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const [currentFocus, setCurrentFocus] = useState(-1)

  const comboBoxRef = useRef(null)
  const optionRef = useRef(null)
  const inputRef = useRef(null)

  // Determine the position(top or bottom) where the suggestion list to be showed
  const suggestCurrentObject: any = comboBoxRef.current

  const suggestionListPosition =
    suggestCurrentObject?.offsetWidth +
    suggestCurrentObject?.offsetParent.offsetTop

  if (suggestionListPosition > window.innerHeight) {
    suggestionListPositionStyles = {
      bottom: '100%',
      marginBottom: '5px'
    }
  }

  // close the suggestion list if the user click outside other than input and suggestion-list
  const handleClickOutside = (event: any) => {
    const inputCurrentObject: any = inputRef.current
    const suggestionCurrentObject: any = comboBoxRef.current
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

  const updateValue = (index: number = currentFocus) => {
    if (index !== -1) {
      setInputValue(options[index])
      if (onOptionsChange) onOptionsChange(options[index])
    }
  }

  const selectSuggestionHandler = () => {
    updateValue()
    setIsFocus(false)
    if (onSelect) onSelect(options[currentFocus])
  }

  const keyHandler = (event: any) => {
    const suggestCurrentObject: any = comboBoxRef.current
    const optionCurrentObject: any = optionRef.current

    switch (event.keyCode) {
      case DOWN_ARROW: {
        // set the focus to true if the options list was not opened.
        if (!isFocus) setIsFocus(true)

        // If the focus reaches the end of the options in the list, set the focus to 0
        if (currentFocus >= options.length - 1) {
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
        comboBoxRef.current = suggestCurrentObject
        break
      }
      case UP_ARROW: {
        // set the focus to true if the options list was not opened.
        if (!isFocus) setIsFocus(true)

        // If the focus falls beyond the start of the options in the list, set the focus to height of the suggestion-list
        if (currentFocus <= 0) {
          setCurrentFocus(options.length - 1)
          updateValue(options.length - 1)

          if (suggestCurrentObject) suggestCurrentObject.scrollTop = 10000
        }
        // Change the scroll position based on the selected option position
        else {
          setCurrentFocus(currentFocus - 1)
          updateValue(currentFocus - 1)

          if (optionCurrentObject && suggestCurrentObject)
            suggestCurrentObject.scrollTop = optionCurrentObject.offsetTop - 30
        }
        comboBoxRef.current = suggestCurrentObject
        break
      }
      case ENTER_KEY: {
        if (currentFocus > -1 && currentFocus < options.length)
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

  const filterSuggestion = (filterText: string) => {
    if (filterText.length === 0) setOptions(comboBoxOptions)
    else {
      const filteredSuggestion = comboBoxOptions.filter((option) => {
        return option.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
      })
      setOptions(filteredSuggestion)
    }
  }

  const inputChangeHandler = (event: any) => {
    if (onChange) onChange(event)
    setInputValue(event.target.value)
    if (enableAutoComplete) filterSuggestion(event.target.value)
  }

  return (
    <div className={styles.comboBox} style={style}>
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
        ref={comboBoxRef}
      >
        <div
          className={styles.comboBoxList}
          style={{ maxHeight: isFocus ? optionMaxHeight : 0 }}
        >
          {options.map((option, index) => {
            return (
              <div
                className={
                  className
                    ? `${styles.comboBoxOption} ${className}`
                    : styles.comboBoxOption
                }
                key={option}
                ref={index === currentFocus ? optionRef : null}
                style={{
                  backgroundColor:
                    index === currentFocus
                      ? focusColor || 'rgba(155,155,155,0.15)'
                      : 'white'
                }}
                onClick={suggestionClickHandler}
                onMouseEnter={() => setCurrentFocus(index)}
              >
                {renderOptions ? renderOptions(option) : option}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ExampleComponent
