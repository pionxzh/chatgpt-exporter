import { createContext, useContext } from 'preact/compat'
import { KEY_FILENAME_FORMAT } from '../constants'
import { useGMStorage } from '../hooks/useGMStorage'
import type { FC } from 'preact/compat'

const defaultFormat = 'ChatGPT-{title}'

const FormatContext = createContext({
    format: defaultFormat,
    setFormat: (_: string) => {},
})

export const FormatProvider: FC = ({ children }) => {
    const [format, setFormat] = useGMStorage(KEY_FILENAME_FORMAT, defaultFormat)

    return (
        <FormatContext.Provider
            value={{ format, setFormat }}
        >
            {children}
        </FormatContext.Provider>
    )
}

export const useFormatContext = () => useContext(FormatContext)
