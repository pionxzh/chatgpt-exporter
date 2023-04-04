type EffectFn = () => (void | (() => void))

/**
 * Effect is a class that represents a group of side effect with their cleanup function.
 * It is used to manage side effects in a declarative way.
 */
export class Effect {
    private _sideEffects: EffectFn[] = []
    private _cleanupFns: Array<() => void> = []
    private _isDisposed = false

    /**
     * Adds a side effect to the effect, with a cleanup function.
     */
    add(sideEffect: EffectFn) {
        if (this._isDisposed) return
        this._sideEffects.push(sideEffect)
    }

    /**
     * Executes all the side effects.
     */
    run() {
        if (this._isDisposed) return
        this._sideEffects.forEach((fn) => {
            const cleanupFn = fn()
            if (cleanupFn) this._cleanupFns.push(cleanupFn)
        })
        this._sideEffects = []
    }

    /**
     * Executes all the cleanup functions.
     * This method should be called when the effect is no longer needed.
     * After this method is called, the effect is considered disposed.
     * Any subsequent call to `add` or `run` will be ignored.
     */
    dispose() {
        if (this._isDisposed) return
        this._cleanupFns.forEach(fn => fn())
        this._cleanupFns = []
        this._isDisposed = true
    }
}
