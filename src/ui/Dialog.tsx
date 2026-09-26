import { createPortal, useEffect, useId, useLayoutEffect, useRef } from 'preact/compat'
import type { ComponentChildren, JSX } from 'preact'

interface DialogProps {
    open: boolean
    /** Called with false on Escape or a backdrop click. The parent may ignore it to keep the dialog open. */
    onOpenChange: (open: boolean) => void
    title: string
    className?: string
    style?: JSX.CSSProperties
    children: ComponentChildren
}

/**
 * A modal on the native <dialog>. showModal() puts it in the top layer and
 * makes the rest of the page inert, so the browser handles stacking, focus
 * and returning focus on close.
 */
export function Dialog({ open, ...props }: DialogProps) {
    if (!open) return null
    return createPortal(<OpenDialog {...props} />, document.body)
}

function OpenDialog({ onOpenChange, title, className, style, children }: Omit<DialogProps, 'open'>) {
    const ref = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const mounted = useRef(true)

    useLayoutEffect(() => {
        const dialog = ref.current!
        mounted.current = true
        // Focus the dialog itself rather than its first control, which
        // would otherwise show a focus ring right after a mouse click.
        dialog.showModal()
        dialog.focus()
        return () => {
            mounted.current = false
            // close() before removal, so focus goes back to the trigger.
            dialog.close()
        }
    }, [])

    const onOpenChangeRef = useRef(onOpenChange)
    onOpenChangeRef.current = onOpenChange
    const close = () => onOpenChangeRef.current(false)

    // Everything outside the dialog box is the backdrop. Chrome targets the
    // <dialog> for a mouse click there but <html> for a tap, so go by the
    // pointer position instead of the target.
    //
    // The page is inert behind a modal, so a backdrop press is ours alone.
    // Stop it before ChatGPT's own outside-click handlers, which would
    // otherwise close the mobile sidebar too.
    useEffect(() => {
        const onBackdropClick = (e: MouseEvent) => {
            e.stopPropagation()
            close()
        }
        const onPointerDown = (e: PointerEvent) => {
            document.removeEventListener('click', onBackdropClick, true)
            const rect = ref.current!.getBoundingClientRect()
            const inside = e.clientX >= rect.left && e.clientX <= rect.right
                && e.clientY >= rect.top && e.clientY <= rect.bottom
            if (inside) return
            e.stopPropagation()
            // Closing on touchstart would let the click land on the page.
            if (e.pointerType === 'touch') {
                document.addEventListener('click', onBackdropClick, { once: true, capture: true })
                return
            }
            close()
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true)
            document.removeEventListener('click', onBackdropClick, true)
        }
    }, [])

    const onCancel = (e: Event) => {
        e.preventDefault()
        close()
    }

    // Chrome closes the dialog without a cancelable `cancel` when Escape is
    // pressed twice without user activation. Reopen it if the parent kept
    // it open.
    const onClose = () => {
        if (!mounted.current) return
        close()
        requestAnimationFrame(() => {
            const dialog = ref.current
            if (mounted.current && dialog && !dialog.open) dialog.showModal()
        })
    }

    return (
        <dialog
            ref={ref}
            className={`ce-root ce-dialog ${className ?? ''}`}
            style={style}
            aria-labelledby={titleId}
            tabIndex={-1}
            onCancel={onCancel}
            onClose={onClose}
        >
            <h2 id={titleId} className="ce-dialog-title">{title}</h2>
            {children}
        </dialog>
    )
}
