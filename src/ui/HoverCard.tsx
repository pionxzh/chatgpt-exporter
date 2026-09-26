import { createPortal, useEffect, useLayoutEffect, useRef } from 'preact/compat'
import type { ComponentChildren } from 'preact'

const CLOSE_DELAY = 300
// Desktop: the card sits right of the trigger, past the arrow, and starts
// this far above it.
const SIDE_OFFSET = 8
const ARROW_WIDTH = 8
const ARROW_HEIGHT = 16
const ALIGN_OFFSET = -64
const VIEWPORT_PADDING = 8

interface HoverCardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Keep the card rendered while closed, e.g. while one of its dialogs is open. */
    keepMounted: boolean
    /** Mobile renders the card in place, desktop in document.body. */
    isMobile: boolean
    width: number
    trigger: ComponentChildren
    children: ComponentChildren
}

/**
 * The exporter menu. Opens on hover or click, closes after the pointer has
 * left both the trigger and the card, on Escape, or on a click elsewhere.
 */
export function HoverCard({ open, onOpenChange, keepMounted, isMobile, width, trigger, children }: HoverCardProps) {
    const triggerRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const arrowRef = useRef<SVGSVGElement>(null)
    const closeTimer = useRef(0)

    const cancelClose = () => clearTimeout(closeTimer.current)
    const onPointerEnter = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        cancelClose()
        onOpenChange(true)
    }
    const onPointerLeave = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        cancelClose()
        closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_DELAY)
    }
    useEffect(() => cancelClose, [])

    useEffect(() => {
        // While a dialog is open, Escape and clicks belong to it.
        if (!open || keepMounted) return
        const close = () => onOpenChange(false)
        const onPointerDown = (e: PointerEvent) => {
            document.removeEventListener('click', close, true)
            const target = e.target as Node
            if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return
            // Closing on touchstart would unmount the backdrop before the
            // click, which then lands on ChatGPT's own overlay. Wait for it.
            if (e.pointerType === 'touch') {
                document.addEventListener('click', close, { once: true, capture: true })
                return
            }
            close()
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false)
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true)
            document.removeEventListener('click', close, true)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open, keepMounted, onOpenChange])

    const mounted = open || keepMounted

    useLayoutEffect(() => {
        if (!mounted) return
        const update = () => {
            const anchor = triggerRef.current
            const card = cardRef.current
            if (!anchor || !card) return
            const rect = anchor.getBoundingClientRect()
            const height = card.offsetHeight
            const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

            let left: number
            let top: number
            if (isMobile) {
                // Below the trigger, or above it when it does not fit.
                left = clamp(rect.left, 0, window.innerWidth - width)
                top = window.innerHeight - rect.bottom >= height ? rect.bottom : rect.top - height
                top = clamp(top, 0, window.innerHeight - height)
            }
            else {
                left = rect.right + SIDE_OFFSET + ARROW_WIDTH
                top = clamp(
                    rect.top + ALIGN_OFFSET,
                    VIEWPORT_PADDING,
                    window.innerHeight - VIEWPORT_PADDING - height,
                )
                const arrow = arrowRef.current
                if (arrow) {
                    const arrowTop = rect.top + rect.height / 2 - top - ARROW_HEIGHT / 2
                    arrow.style.top = `${clamp(arrowTop, 0, height - ARROW_HEIGHT)}px`
                }
            }
            card.style.left = `${left}px`
            card.style.top = `${top}px`
        }
        update()
        window.addEventListener('resize', update)
        window.addEventListener('scroll', update, true)
        return () => {
            window.removeEventListener('resize', update)
            window.removeEventListener('scroll', update, true)
        }
    }, [mounted, isMobile, width])

    const card = mounted && (
        <div
            ref={cardRef}
            className={`ce-root ce-card${isMobile ? ' ce-card-mobile' : ''}`}
            style={{ width }}
            data-state={open ? 'open' : 'closed'}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            {children}
            {!isMobile && (
                <svg
                    ref={arrowRef}
                    className="ce-card-arrow"
                    width={ARROW_WIDTH}
                    height={ARROW_HEIGHT}
                    viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
                    aria-hidden="true"
                >
                    <polygon points={`${ARROW_WIDTH},0 0,${ARROW_HEIGHT / 2} ${ARROW_WIDTH},${ARROW_HEIGHT}`} />
                </svg>
            )}
        </div>
    )

    return (
        <>
            <div
                ref={triggerRef}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
            >
                {trigger}
            </div>
            {card && (isMobile ? card : createPortal(card, document.body))}
        </>
    )
}
