import type { FC } from '../type'

export const Dropdown: FC = ({ children }) => {
    return (
        <>
            <div className="dropdown-backdrop"></div>
            <div className="dropdown-menu bg-gray-900">
                {children}
            </div>
        </>
    )
}
