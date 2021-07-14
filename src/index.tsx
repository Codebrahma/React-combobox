import React, { useState, useRef, useEffect, useReducer } from 'react'

import { initialState, focusReducer } from './reducer/focusReducer'
import styles from './index.css'

type ComboBoxProps = {
  options: string[]
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string
  placeholder?: string
  onSelect?: (option: string) => void
  onOptionsChange?: (option: string) => void
  optionsListMaxHeight?: number
  renderOptions?: (option: string) => React.ReactNode
  style?: React.CSSProperties
  className?: string
  inputClassName?: string
  wrapperClassName?: string
  listClassName?: string
  popoverClassName?: string
  focusColor?: string
  enableAutocomplete?: boolean
  inputStyles?: React.CSSProperties
  name?: string
  onBlur?: (event?: React.ChangeEvent<HTMLInputElement>) => void
  editable?: boolean
}

const UP_ARROW = 38
const DOWN_ARROW = 40
const ENTER_KEY = 13
const ESCAPE_KEY = 27

const ComboBox: React.FC<ComboBoxProps> = ({
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
  inputClassName,
  wrapperClassName,
  listClassName,
  popoverClassName,
  focusColor,
  enableAutocomplete,
  inputStyles,
  name,
  onBlur,
  editable = true
}) => {
  const optionMaxHeight = optionsListMaxHeight || 200
  let suggestionListPositionStyles: React.CSSProperties = {}

  // Function that will check whether the defaultIndex falls inside the length of the options
  // or else it will return -1

  const [options, setOptions] = useState<string[]>(comboBoxOptions)
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const [state, dispatch] = useReducer(focusReducer, initialState)
  const { isFocus, focusIndex } = state
  const [isMouseInsideOptions, setIsMouseInsideOptions] = useState(false) // This is used to determine whether the mouse cursor is inside or outside options container
  const [IsOptionsPositionedTop, setIsOptionsPositionedTop] = useState(false)

  const optionsContainerRef = useRef<HTMLDivElement | null>(null)
  const optionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFocus) setInputValue(defaultValue || '')
    dispatch({
      type: 'setFocusIndex',
      focusIndex: defaultValue ? options.indexOf(defaultValue.toString()) : -1
    })
  }, [defaultValue])

  useEffect(() => {
    // Position the options container top or bottom based on the space available
    const optionsContainerElement: any = optionsContainerRef.current

    const offsetBottom =
      window.innerHeight -
      optionsContainerElement?.offsetParent?.getBoundingClientRect().top

    if (
      optionMaxHeight > offsetBottom &&
      optionsContainerElement?.offsetParent?.getBoundingClientRect().top >
        offsetBottom
    ) {
      setIsOptionsPositionedTop(true)
    } else {
      setIsOptionsPositionedTop(false)
    }
  }, [isFocus])

  if (IsOptionsPositionedTop)
    suggestionListPositionStyles = {
      bottom: '100%',
      marginBottom: '5px'
    }
  else
    suggestionListPositionStyles = {
      top: '100%',
      marginTop: '5px'
    }

  const blurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMouseInsideOptions) dispatch({ type: 'toggleFocus', isFocus: false })
    if (onBlur) onBlur(event)
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
    const optionsContainerElement: any = optionsContainerRef.current
    const optionElement: any = optionRef.current
    let newFocusIndex = focusIndex

    switch (event.keyCode) {
      case DOWN_ARROW: {
        event.preventDefault()

        // set the focus to true if the options list was not opened.
        // Also set the scroll top
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
          if (optionElement && optionsContainerElement)
            optionsContainerElement.scrollTop =
              optionElement.offsetTop - optionElement.offsetHeight
        } else {
          // If the focus reaches the end of the options in the list, set the focus to 0

          if (focusIndex >= options.length - 1) {
            newFocusIndex = 0
            optionsContainerElement.scrollTop = 0
          }
          // Change the scroll position based on the selected option position
          else {
            newFocusIndex = focusIndex + 1
            if (optionElement && optionsContainerElement) {
              const optionPosition =
                optionElement.offsetTop + optionElement.offsetHeight

              const optionsContainerPosition =
                optionsContainerElement.clientHeight +
                optionsContainerElement.scrollTop -
                optionElement.offsetHeight

              // Measured the option position with the suggestion height
              // changed the scroll top if the option reached the end of the options container height

              if (optionPosition >= optionsContainerPosition) {
                optionsContainerElement.scrollTop += optionElement.offsetHeight
              }
            }
          }
        }
        dispatch({
          type: 'setFocusIndex',
          focusIndex: newFocusIndex
        })

        if (onOptionsChange) onOptionsChange(options[newFocusIndex])
        optionsContainerRef.current = optionsContainerElement
        break
      }
      case UP_ARROW: {
        event.preventDefault()

        // set the focus to true if the options list was not opened.
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
          if (optionElement && optionsContainerElement)
            optionsContainerElement.scrollTop =
              optionElement.offsetTop - optionElement.offsetHeight
        } else {
          // If the focus falls beyond the start of the options in the list, set the focus to height of the suggestion-list
          if (focusIndex <= 0) {
            newFocusIndex = options.length - 1

            if (optionsContainerElement)
              optionsContainerElement.scrollTop =
                optionsContainerElement.scrollHeight
          } else {
            newFocusIndex = focusIndex - 1

            // Measured the option position with the suggestion height
            // changed the scroll top if the option reached the start of the options container height
            if (optionElement && optionsContainerElement) {
              const optionPosition =
                optionElement.offsetTop - optionElement.offsetHeight
              if (optionPosition <= optionsContainerElement.scrollTop) {
                optionsContainerElement.scrollTop -= optionElement.offsetHeight
              }
            }
          }
        }
        dispatch({
          type: 'setFocusIndex',
          focusIndex: newFocusIndex
        })

        if (onOptionsChange) onOptionsChange(options[newFocusIndex])
        optionsContainerRef.current = optionsContainerElement
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

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event)
    setInputValue(event.target.value)
    if (enableAutocomplete) filterSuggestion(event.target.value)
  }

  const inputClickHandler = () => {
    dispatch({
      type: 'toggleFocus',
      isFocus: true
    })
    dispatch({
      type: 'setFocusIndex',
      focusIndex: options.indexOf(inputValue.toString())
    })
  }

  const focusHandler = () => {
    const optionsContainerElement: any = optionsContainerRef.current
    const optionElement: any = optionRef.current

    optionsContainerElement.scrollTop = optionElement?.offsetTop
    dispatch({ type: 'toggleFocus', isFocus: true })
  }

  const mouseEnterHandler = (index: number) => {
    dispatch({ type: 'setFocusIndex', focusIndex: index })
    if (onOptionsChange) onOptionsChange(options[index])
  }

  return (
    <div className={wrapperClassName ?`${styles.comboBox} ${wrapperClassName}` : styles.comboBox} style={style}>
      <input
        onFocus={focusHandler}
        onChange={inputChangeHandler}
        placeholder={placeholder || ''}
        onKeyDown={keyHandler}
        value={inputValue}
        className={inputClassName ? `${styles.comboBoxInput} ${inputClassName}` : styles.comboBoxInput}
        onBlur={blurHandler}
        name={name}
        style={{ ...inputStyles, cursor: editable ? 'text' : 'default' }}
        readOnly={!editable}
        onClick={inputClickHandler}
      />
      <div
        className={popoverClassName ? `${styles.comboBoxPopover} ${popoverClassName}` : styles.comboBoxPopover}
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
          className={listClassName ? `${styles.comboBoxList} ${listClassName}` : styles.comboBoxList}
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
                      : 'white',
                  fontWeight: index === focusIndex ? 'bold' : 'normal'
                }}
                onClick={() => selectSuggestionHandler()}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => mouseEnterHandler(index)}
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

export default ComboBox
