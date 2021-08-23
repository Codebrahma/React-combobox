// eslint-disable-next-line no-unused-vars
import { useEffect, RefObject } from 'react'

const useScroll = (
  focusedIndex: number,
  scrollableContainer: RefObject<HTMLDivElement>,
  listContainer: RefObject<HTMLUListElement>
) => {
  useEffect(() => {
    if (
      listContainer.current &&
      scrollableContainer.current &&
      focusedIndex >= 0
    ) {
      if (focusedIndex === 0)
        scrollableContainer.current.scrollTo({
          top: 0
        })
      const children = listContainer.current.childNodes
      const focusedChild =
        children && children.length
          ? (children[focusedIndex] as HTMLDivElement)
          : null

      if (focusedChild && focusedChild.getBoundingClientRect) {
        const { height: optionHeight } = focusedChild.getBoundingClientRect()
        const {
          height: listHeight
        } = scrollableContainer.current.getBoundingClientRect()
        const scrollTop = scrollableContainer.current.scrollTop
        const isAbove = focusedChild.offsetTop <= scrollTop
        const isInView =
          focusedChild.offsetTop >= scrollTop &&
          focusedChild.offsetTop + optionHeight <= scrollTop + listHeight

        if (!isInView) {
          if (isAbove) {
            scrollableContainer.current.scrollTo({
              top: focusedChild.offsetTop
            })
          } else {
            scrollableContainer.current.scrollTo({
              top: focusedChild.offsetTop - listHeight + optionHeight
            })
          }
        }
      }
    }
  }, [focusedIndex, listContainer, scrollableContainer])
}

export default useScroll
