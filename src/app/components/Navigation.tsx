import SVG from 'react-inlinesvg';
import type { BoxProps } from 'rebass';

import { Box } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import add from '@assets/icons/add.svg';
import lock from '@assets/icons/lock.svg';
import profile from '@assets/icons/profile.svg';
import { logout } from '@common/store';
import { Logo } from '@components/Logo';
import { useDispatch } from '@store';

import LinkApp from './Core/LinkApp';

const NavIcon = ({
  icon,
  href,
  onClick,
  ...rest
}: { icon: string; href: string; onClick?(): void } & BoxProps) => (
  <LinkApp href={href} variant="barren" style={{ color: 'white' }} onClick={onClick}>
    <Box
      variant="horizontal-start"
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
      variant="horizontal-start"
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
      <Box variant="horizontal-start">
        <LinkApp href={ROUTE_PATHS.HOME}>
          <Logo marginLeft="18px" />
        </LinkApp>
      </Box>
      {isLoggedIn && (
        <Box display="flex" ml="auto" variant="horizontal-start">
          <NavIcon icon={lock} href="#" onClick={handleLogout} data-testid="lock-button" />
          <NavIcon icon={profile} href={ROUTE_PATHS.ACCOUNTS} />
          <NavIcon icon={add} href={ROUTE_PATHS.MENU} />
        </Box>
      )}
    </Box>
  );
};
