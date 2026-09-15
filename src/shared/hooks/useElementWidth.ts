import { useLayoutEffect, useState, type RefObject } from 'react'

/**
 * Tracks an element's rendered width so an SVG can be drawn at a 1:1 scale.
 * Drawing into a fixed viewBox instead would shrink every label on narrow
 * screens, because the whole canvas scales with the container.
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number {
	const [width, setWidth] = useState(0)

	useLayoutEffect(() => {
		const element = ref.current
		if (!element) return

		const observer = new ResizeObserver(([entry]) => {
			if (entry) setWidth(entry.contentRect.width)
		})
		observer.observe(element)
		setWidth(element.getBoundingClientRect().width)

		return () => observer.disconnect()
	}, [ref])

	return width
}
