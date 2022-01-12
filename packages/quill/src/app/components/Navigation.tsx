import { Flex, Heading, Tooltip } from '@mycrypto/ui';
import { getNavigationBack, logout, translateRaw } from '@quill/common';
import { getLocation } from 'connected-react-router';
import type { PropsWithChildren } from 'react';
import SVG from 'react-inlinesvg';
import type { BoxProps } from 'rebass';

import { Box } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import add from '@assets/icons/add.svg';
import back from '@assets/icons/back.svg';
import lock from '@assets/icons/lock.svg';
import settings from '@assets/icons/settings.svg';
import { useDispatch, useSelector } from '@store';

import LinkApp from './Core/LinkApp';
import { NavigationLogo } from './NavigationLogo';

const NavIcon = ({
  icon,
  tooltip,
  href,
  onClick,
  ...rest
}: { icon: string; tooltip: string; href: string; onClick?(): void } & BoxProps) => (
  <Tooltip tooltip={tooltip}>
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
  </Tooltip>
);

const NavItem = ({ href, children }: PropsWithChildren<{ href?: string }>) => {
  const location = useSelector(getLocation);
  const isActive = href && location.pathname === href;

  return (
    <Box
      p="12px"
      backgroundColor={isActive && 'navigation.active'}
      sx={{ borderRadius: 'badge' }}
      display="flex"
    >
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
    <Flex
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
      flexDirection="row"
      alignItems="center"
    >
      <Flex flex="1" pl="12px">
        <LinkApp href={ROUTE_PATHS.HOME}>
          <NavigationLogo />
        </LinkApp>
      </Flex>
      <Flex flex="1" justifyContent="center">
        <Heading
          color="white"
          fontSize="18px"
          fontWeight="900"
          letterSpacing="4px"
          sx={{ textTransform: 'uppercase' }}
        >
          {translateRaw('QUILL')}
        </Heading>
      </Flex>
      <Flex flex="1" justifyContent="flex-end">
        {isLoggedIn && (
          <>
            <NavItem>
              <NavIcon
                icon={lock}
                tooltip={translateRaw('LOCK')}
                href="#"
                onClick={handleLogout}
                data-testid="lock-button"
              />
            </NavItem>
            <NavItem href={ROUTE_PATHS.SETTINGS}>
              <NavIcon
                icon={settings}
                tooltip={translateRaw('SETTINGS')}
                href={ROUTE_PATHS.SETTINGS}
              />
            </NavItem>
            <NavItem href={ROUTE_PATHS.MENU}>
              {backUrl ? (
                <NavIcon icon={back} tooltip={translateRaw('BACK')} href={backUrl} />
              ) : (
                <NavIcon icon={add} tooltip={translateRaw('ADD')} href={ROUTE_PATHS.MENU} />
              )}
            </NavItem>
          </>
        )}
      </Flex>
    </Flex>
  );
};
