import React, {
  useState,
  useRef,
  useEffect,
  useReducer,
  ReactElement
} from 'react'

import { initialState, focusReducer } from './reducer/focusReducer'
import styles from './index.css'
import useScroll from './hooks/useScroll'

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
  highlightColor?: string
  selectedOptionColor?: string
  enableAutocomplete?: boolean
  inputStyles?: React.CSSProperties
  name?: string
  onBlur?: (event?: React.ChangeEvent<HTMLInputElement>) => void
  editable?: boolean
  renderRightElement?: () => ReactElement
  renderLeftElement?: () => ReactElement
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
  highlightColor,
  selectedOptionColor,
  enableAutocomplete,
  inputStyles,
  name,
  onBlur,
  editable = true,
  renderRightElement,
  renderLeftElement
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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const optionsListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!isFocus) setInputValue(defaultValue || '')
    dispatch({
      type: 'setFocusIndex',
      focusIndex: defaultValue ? options.indexOf(defaultValue.toString()) : -1
    })
  }, [defaultValue])

  useScroll(focusIndex, dropdownRef, optionsListRef)

  useEffect(() => {
    // Position the options container top or bottom based on the space available
    const optionsContainerElement: any = dropdownRef.current

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
    setSelectedOptionIndex(focusIndex)
    resetFocusIndex()
    setOptions(comboBoxOptions)

    if (onSelect) onSelect(options[focusIndex])
  }

  const keyHandler = (event: any) => {
    const optionsContainerElement: any = dropdownRef.current
    let newFocusIndex = focusIndex

    switch (event.keyCode) {
      case DOWN_ARROW: {
        event.preventDefault()

        // set the focus to true if the options list was not opened.
        // Also set the scroll top
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
        } else {
          // If the focus reaches the end of the options in the list, set the focus to 0

          if (focusIndex >= options.length - 1) {
            newFocusIndex = 0
            optionsContainerElement.scrollTop = 0
          }
          // Change the scroll position based on the selected option position
          else {
            newFocusIndex = focusIndex + 1
          }
        }
        dispatch({
          type: 'setFocusIndex',
          focusIndex: newFocusIndex
        })

        if (onOptionsChange) onOptionsChange(options[newFocusIndex])
        dropdownRef.current = optionsContainerElement
        break
      }
      case UP_ARROW: {
        event.preventDefault()

        // set the focus to true if the options list was not opened.
        if (!isFocus) {
          dispatch({ type: 'toggleFocus', isFocus: true })
        } else {
          // If the focus falls beyond the start of the options in the list, set the focus to height of the suggestion-list
          if (focusIndex <= 0) {
            newFocusIndex = options.length - 1

            if (optionsContainerElement)
              optionsContainerElement.scrollTop =
                optionsContainerElement.scrollHeight
          } else {
            newFocusIndex = focusIndex - 1
          }
        }
        dispatch({
          type: 'setFocusIndex',
          focusIndex: newFocusIndex
        })

        if (onOptionsChange) onOptionsChange(options[newFocusIndex])
        dropdownRef.current = optionsContainerElement
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
    dispatch({ type: 'toggleFocus', isFocus: true })
  }

  const mouseEnterHandler = (index: number) => {
    dispatch({ type: 'setFocusIndex', focusIndex: index })
    if (onOptionsChange) onOptionsChange(options[index])
  }

  const backgroundColorSelector = (optionIndex: number) => {
    if (optionIndex === focusIndex && optionIndex === selectedOptionIndex)
      return selectedOptionColor || '#63b3ed'
    else if (optionIndex === focusIndex) {
      return highlightColor || '#bee3f8'
    } else if (optionIndex === selectedOptionIndex) {
      return selectedOptionColor || '#63b3ed'
    } else return 'white'
  }

  return (
    <div
      className={
        wrapperClassName
          ? `${styles.comboBox} ${wrapperClassName}`
          : styles.comboBox
      }
      style={style}
    >
      {renderLeftElement && (
        <div className={styles.leftElement}>{renderLeftElement()}</div>
      )}
      <input
        onFocus={focusHandler}
        onChange={inputChangeHandler}
        placeholder={placeholder || ''}
        onKeyDown={keyHandler}
        value={inputValue}
        className={
          inputClassName
            ? `${styles.comboBoxInput} ${inputClassName}`
            : styles.comboBoxInput
        }
        onBlur={blurHandler}
        name={name}
        style={{
          ...inputStyles,
          cursor: editable ? 'text' : 'pointer',
          paddingLeft: renderLeftElement ? 30 : 10
        }}
        readOnly={!editable}
        onClick={inputClickHandler}
      />
      {renderRightElement && (
        <div className={styles.rightElement}>{renderRightElement()}</div>
      )}
      <div
        className={
          popoverClassName
            ? `${styles.comboBoxPopover} ${popoverClassName}`
            : styles.comboBoxPopover
        }
        style={{
          opacity: isFocus ? 1 : 0,
          visibility: isFocus ? 'visible' : 'hidden',
          maxHeight: isFocus ? optionMaxHeight : 0,
          ...suggestionListPositionStyles
        }}
        ref={dropdownRef}
        onMouseEnter={() => setIsMouseInsideOptions(true)}
        onMouseLeave={() => setIsMouseInsideOptions(false)}
      >
        <ul
          className={
            listClassName
              ? `${styles.comboBoxList} ${listClassName}`
              : styles.comboBoxList
          }
          ref={optionsListRef}
        >
          {options.map((option, index) => {
            return (
              <li
                className={
                  className
                    ? `${styles.comboBoxOption} ${className}`
                    : styles.comboBoxOption
                }
                key={option}
                style={{
                  backgroundColor: backgroundColorSelector(index)
                }}
                onClick={() => selectSuggestionHandler()}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => mouseEnterHandler(index)}
              >
                {renderOptions ? renderOptions(option) : option}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ComboBox
