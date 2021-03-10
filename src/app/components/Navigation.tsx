import React from 'react';

import { logout, useDispatch } from '@store';
import SVG from 'react-inlinesvg';
import { BoxProps } from 'rebass';

import { Box } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import add from '@assets/icons/add.svg';
import lock from '@assets/icons/lock.svg';
import profile from '@assets/icons/profile.svg';
import { Logo } from '@components/Logo';

import LinkApp from './Core/LinkApp';

const NavIcon = ({
  icon,
  href,
  onClick,
  ...rest
}: { icon: string; href: string; onClick?(): void } & BoxProps) => (
  <LinkApp href={href} variant="barren" style={{ color: 'white' }} onClick={onClick}>
    <Box
      variant="rowAlign"
      mx="10px"
      sx={{
        '-webkit-app-region': 'no-drag'
      }}
      {...rest}
    >
      <SVG height="20px" width="20px" src={icon} />
    </Box>
  </LinkApp>
);

export const Navigation = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      variant="rowAlign"
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
      <Box variant="rowAlign">
        <LinkApp href={ROUTE_PATHS.HOME}>
          <Logo marginLeft="18px" />
        </LinkApp>
      </Box>
      {isLoggedIn && (
        <Box display="flex" ml="auto" variant="rowAlign">
          <NavIcon icon={lock} href="#" onClick={handleLogout} data-testid="lock-button" />
          <NavIcon icon={profile} href={ROUTE_PATHS.ACCOUNTS} />
          <NavIcon icon={add} href={ROUTE_PATHS.MENU} />
        </Box>
      )}
    </Box>
  );
};
