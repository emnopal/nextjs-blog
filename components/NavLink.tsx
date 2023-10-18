import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { CSSProperties, ReactNode } from 'react';

interface INavLink {
    children: ReactNode
    href: string
    exact?: boolean
    className?: string
    style?: CSSProperties
}

export function NavLink({ children, href, exact, ...props }: INavLink): JSX.Element {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        props.className += ' active';
    }

    return <Link href={href} {...props}>{children}</Link>;
}

NavLink.propTypes = {
    href: PropTypes.string.isRequired,
    exact: PropTypes.bool,
};

NavLink.defaultProps = {
    exact: false
};
