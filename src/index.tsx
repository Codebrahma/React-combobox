import React, { useState, useRef, useEffect, useReducer } from 'react'

import { initialState, focusReducer } from './reducer/focusReducer'
import styles from './index.css'

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T
  // probably you might want to add the currentTarget as well
  // currentTarget: T;
}

type ComboBoxProps = {
  options: string[]
  onChange?: (event: HTMLElementEvent<HTMLInputElement>) => void
  defaultIndex?: number
  placeholder?: string
  onSelect?: (option: string) => void
  onOptionsChange?: (option: string) => void
  optionsListMaxHeight?: number
  renderOptions?: (option: string) => React.ReactNode
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
  defaultIndex,
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

  // Function that will check whether the defaultIndex falls inside the length of the options
  // or else it will return -1
  const getDefaultIndex = () => {
    if (defaultIndex && defaultIndex >= 0 && defaultIndex < options.length) {
      return defaultIndex
    } else return -1
  }

  const [options, setOptions] = useState<string[]>(comboBoxOptions)
  const [inputValue, setInputValue] = useState(
    getDefaultIndex() !== -1 ? options[getDefaultIndex()] : ''
  )
  const [state, dispatch] = useReducer(focusReducer, initialState)
  const { isFocus, focusIndex } = state
  const [isMouseInsideOptions, setIsMouseInsideOptions] = useState(false)

  const optionsContainerRef = useRef(null)
  const optionRef = useRef(null)
  const inputRef = useRef(null)

  // Determine the position(top or bottom) where the suggestion list to be showed
  const optionsContainerRefObject: any = optionsContainerRef.current

  const suggestionListPosition =
    optionsContainerRefObject?.offsetWidth +
    optionsContainerRefObject?.offsetParent.offsetTop

  if (suggestionListPosition > window.innerHeight) {
    suggestionListPositionStyles = {
      bottom: '100%',
      marginBottom: '5px'
    }
  }

  // Set the default index when the component is mounted
  useEffect(() => {
    dispatch({ type: 'setFocusIndex', focusIndex: getDefaultIndex() })
  }, [])

  const blurHandler = () => {
    if (!isMouseInsideOptions) dispatch({ type: 'toggleFocus', isFocus: false })
  }

  const updateValue = (index: number = focusIndex) => {
    if (index !== -1) {
      setInputValue(options[index])
      if (onOptionsChange) onOptionsChange(options[index])
    }
  }

  // While searching, the options are filtered and the index also changed.
  // So the focus index is set to original based on all the options.
  const resetFocusIndex = () => {
    comboBoxOptions.forEach((option: string, index: number) => {
      if (option === options[focusIndex])
        dispatch({
          type: 'setFocusIndex',
          focusIndex: index
        })
    })
  }

  const selectSuggestionHandler = () => {
    updateValue()
    dispatch({ type: 'toggleFocus', isFocus: false })
    resetFocusIndex()
    setOptions(comboBoxOptions)

    if (onSelect) onSelect(options[focusIndex])
  }

  const keyHandler = (event: any) => {
    const optionsContainerRefObject: any = optionsContainerRef.current
    const optionCurrentObject: any = optionRef.current

    switch (event.keyCode) {
      case DOWN_ARROW: {
        // set the focus to true if the options list was not opened.
        // Also set the scroll top
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
          if (optionCurrentObject && optionsContainerRefObject)
            optionsContainerRefObject.scrollTop =
              optionCurrentObject.offsetTop - optionCurrentObject.offsetHeight
        } else {
          // If the focus reaches the end of the options in the list, set the focus to 0
          if (focusIndex >= options.length - 1) {
            dispatch({
              type: 'setFocusIndex',
              focusIndex: 0
            })
            optionsContainerRefObject.scrollTop = 0
          }
          // Change the scroll position based on the selected option position
          else {
            dispatch({
              type: 'setFocusIndex',
              focusIndex: focusIndex + 1
            })
            if (optionCurrentObject && optionsContainerRefObject) {
              const optionPosition =
                optionCurrentObject.offsetTop + optionCurrentObject.offsetHeight

              const optionsContainerPosition =
                optionsContainerRefObject.clientHeight +
                optionsContainerRefObject.scrollTop -
                optionCurrentObject.offsetHeight

              // Measured the option position with the suggestion height
              // changed the scroll top if the option reached the end of the options container height

              if (optionPosition >= optionsContainerPosition) {
                optionsContainerRefObject.scrollTop +=
                  optionCurrentObject.offsetHeight
              }
            }
          }
        }
        optionsContainerRef.current = optionsContainerRefObject
        break
      }
      case UP_ARROW: {
        // set the focus to true if the options list was not opened.
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
          if (optionCurrentObject && optionsContainerRefObject)
            optionsContainerRefObject.scrollTop =
              optionCurrentObject.offsetTop + optionCurrentObject.offsetHeight
        } else {
          // If the focus falls beyond the start of the options in the list, set the focus to height of the suggestion-list
          if (focusIndex <= 0) {
            dispatch({
              type: 'setFocusIndex',
              focusIndex: options.length - 1
            })

            if (optionsContainerRefObject)
              optionsContainerRefObject.scrollTop = 10000
          } else {
            dispatch({
              type: 'setFocusIndex',
              focusIndex: focusIndex - 1
            })

            // Measured the option position with the suggestion height
            // changed the scroll top if the option reached the start of the options container height
            if (optionCurrentObject && optionsContainerRefObject) {
              const optionPosition =
                optionCurrentObject.offsetTop - optionCurrentObject.offsetHeight
              if (optionPosition <= optionsContainerRefObject.scrollTop) {
                optionsContainerRefObject.scrollTop -=
                  optionCurrentObject.offsetHeight
              }
            }
          }
        }
        optionsContainerRef.current = optionsContainerRefObject
        break
      }
      case ENTER_KEY: {
        if (focusIndex > -1 && focusIndex < options.length)
          selectSuggestionHandler()

        break
      }
      case ESCAPE_KEY: {
        event.target.blur()
        dispatch({ type: 'toggleFocus', isFocus: false })
        break
      }
    }
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
        onFocus={() => dispatch({ type: 'toggleFocus', isFocus: true })}
        onChange={inputChangeHandler}
        ref={inputRef}
        placeholder={placeholder || ''}
        onKeyDown={keyHandler}
        value={inputValue}
        className={styles.comboBoxInput}
        onBlur={blurHandler}
      />

      <div
        className={styles.comboBoxPopover}
        style={{
          opacity: isFocus ? 1 : 0,
          visibility: isFocus ? 'visible' : 'hidden',
          ...suggestionListPositionStyles
        }}
        ref={optionsContainerRef}
        onMouseEnter={() => setIsMouseInsideOptions(true)}
        onMouseLeave={() => setIsMouseInsideOptions(false)}
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
                ref={index === focusIndex ? optionRef : null}
                style={{
                  backgroundColor:
                    index === focusIndex
                      ? focusColor || 'rgba(155,155,155,0.15)'
                      : 'white'
                }}
                onClick={selectSuggestionHandler}
                onMouseEnter={() =>
                  dispatch({ type: 'setFocusIndex', focusIndex: index })
                }
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
