import getDeviceType from 'lib/util/device'
import clamp from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import React, {
  createContext, useContext, useEffect, useRef, useState,
} from 'react'

interface CarouselContextProps {
  currentIndex: number
}

const CarouselContext = createContext<CarouselContextProps>(null)

export const useCarousel = () => useContext(CarouselContext)

export default function Carousel({
  children,
  className,
  extraChild,
}: {
  children: React.ReactNode[]
  className?: string
  extraChild?: React.ReactNode
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>()
  const currentIndexRef = useRef<number>(currentIndex)

  const transitionData = {
    animation: null,
    ease: 0.06,
    dst: 0,
    prev: 0,
    result: 0,
  }

  const dragData = {
    origin: 0,
    from: 0,
    control: false,
    duration: 0,
    threshold: 120,
  }

  const animate = (): void => {
    transitionData.animation = requestAnimationFrame(animate)

    if (!containerRef.current) {
      return
    }
    const { offsetWidth } = containerRef.current

    if (!dragData.control) {
      const { ease, prev } = transitionData
      transitionData.dst = -1 * currentIndexRef.current * offsetWidth
      transitionData.prev += (transitionData.dst - prev) * ease
    }

    transitionData.result = clamp(transitionData.prev, -1 * offsetWidth * (children.length - 1), 0)
    const result = Math.round(transitionData.result * 10) / 10

    containerRef.current.style.transform = `translateX(${result}px)`
  }

  const onMouseDown = (e: MouseEvent | TouchEvent): void => {
    document.body.addEventListener('mouseup', onDragEnd)
    document.body.addEventListener('mousemove', onDrag)
    onDragStart(e)
  }

  const onDragStart = (e: MouseEvent | TouchEvent): void => {
    containerRef.current.style.transition = ''
    dragData.control = true
    dragData.origin = transitionData.result
    dragData.from = getPosition(e).x
    dragData.duration = 0
  }

  const onDrag = (e: MouseEvent | TouchEvent): void => {
    const { origin, from } = dragData
    transitionData.prev = origin + getPosition(e).x - from
    dragData.duration += 1
  }

  const onDragEnd = (): void => {
    const { origin, duration, threshold } = dragData
    const distance = transitionData.result - origin
    const { offsetWidth } = containerRef.current
    const ratio = distance / offsetWidth
    const result = -1 * Math.floor(ratio)
    const remainder = distance % offsetWidth

    if (Math.abs(remainder / offsetWidth) > Math.min(duration, threshold) * 0.005) {
      const value = ratio > 0 ? (result - 1) : result
      setCurrentIndex((index) => clamp(index + value, 0, children.length - 1))
    }

    dragData.control = false

    document.body.removeEventListener('mouseup', onMouseDown)
    document.body.removeEventListener('mousemove', onDrag)
  }

  const initializeEventListener = () => {
    const { current } = containerRef
    if (getDeviceType() === 'desktop') {
      current.addEventListener('mousedown', onMouseDown)
      return
    }
    current.addEventListener('touchstart', onDragStart)
    current.addEventListener('touchmove', onDrag)
    current.addEventListener('touchend', onDragEnd)
  }

  useEffect(() => {
    transitionData.animation = requestAnimationFrame(animate)
    initializeEventListener()
    return () => cancelAnimationFrame(transitionData.animation)
  }, [])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const value = {
    currentIndex,
  }

  return (
    <CarouselContext.Provider value={value}>
      <div className={className} ref={containerRef}>
        {children}
      </div>
      {extraChild}
    </CarouselContext.Provider>
  )
}

Carousel.defaultProps = {
  className: null,
  extraChild: null,
}
