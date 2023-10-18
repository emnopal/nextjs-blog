import { ReactNode } from 'react';

interface ILayout {
    children: ReactNode
}

export function Layout({ children }: ILayout) {
    return (
        <div className="p-4">
            <div className="container">
                {children}
            </div>
        </div>
    );
}