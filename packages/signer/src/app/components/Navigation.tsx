import { getNavigationBack, logout } from '@signer/common';
import { getLocation } from 'connected-react-router';
import type { PropsWithChildren } from 'react';
import SVG from 'react-inlinesvg';
import type { BoxProps } from 'rebass';

import { Box } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import add from '@assets/icons/add.svg';
import back from '@assets/icons/back.svg';
import lock from '@assets/icons/lock.svg';
import profile from '@assets/icons/profile.svg';
import { Logo } from '@components/Logo';
import { useDispatch, useSelector } from '@store';

import LinkApp from './Core/LinkApp';

const NavIcon = ({
  icon,
  href,
  onClick,
  ...rest
}: { icon: string; href: string; onClick?(): void } & BoxProps) => (
  <LinkApp
    data-testid="nav-icon"
    href={href}
    variant="barren"
    style={{ color: 'white' }}
    onClick={onClick}
  >
    <Box
      variant="horizontal-start"
      sx={{
        '-webkit-app-region': 'no-drag'
      }}
      {...rest}
    >
      <SVG height="20px" width="20px" src={icon} />
    </Box>
  </LinkApp>
);

const NavItem = ({ href, children }: PropsWithChildren<{ href?: string }>) => {
  const location = useSelector(getLocation);
  const isActive = href && location.pathname === href;

  return (
    <Box p="12px" backgroundColor={isActive && 'navigation.active'} sx={{ borderRadius: 'badge' }}>
      {children}
    </Box>
  );
};

export const Navigation = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const dispatch = useDispatch();
  const backUrl = useSelector(getNavigationBack);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      variant="horizontal-start"
      px="2"
      sx={{
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        bg: 'BLUE_DARK_SLATE',
        userSelect: 'none',
        '-webkit-app-region': 'drag'
      }}
      width="100%"
      height="65px"
      overflow="hidden"
    >
      <NavItem href={ROUTE_PATHS.HOME}>
        <Box variant="horizontal-start">
          <LinkApp href={ROUTE_PATHS.HOME}>
            <Logo />
          </LinkApp>
        </Box>
      </NavItem>
      {isLoggedIn && (
        <Box display="flex" ml="auto" variant="horizontal-start">
          <NavItem>
            <NavIcon icon={lock} href="#" onClick={handleLogout} data-testid="lock-button" />
          </NavItem>
          <NavItem href={ROUTE_PATHS.ACCOUNTS}>
            <NavIcon icon={profile} href={ROUTE_PATHS.ACCOUNTS} />
          </NavItem>
          <NavItem href={ROUTE_PATHS.MENU}>
            {backUrl ? (
              <NavIcon icon={back} href={backUrl} />
            ) : (
              <NavIcon icon={add} href={ROUTE_PATHS.MENU} />
            )}
          </NavItem>
        </Box>
      )}
    </Box>
  );
};
