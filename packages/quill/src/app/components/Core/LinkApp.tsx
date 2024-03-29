import { Image } from '@mycrypto/ui';
import type { FC } from 'react';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'rebass/styled-components';
import styled from 'styled-components';
import type {
  ColorProps,
  ColorStyleProps,
  FontStyleProps,
  LayoutProps,
  LineHeightProps,
  SizeProps,
  SpaceProps,
  TextStyleProps,
  TypographyProps
} from 'styled-system';
import {
  color,
  colorStyle,
  fontStyle,
  layout,
  lineHeight,
  size,
  space,
  textStyle,
  typography,
  variant
} from 'styled-system';

import { LINK_VARIANTS } from '@app/theme';
import linkOut from '@assets/icons/link-out.svg';

type LinkStyleProps = SpaceProps &
  LineHeightProps &
  FontStyleProps &
  SizeProps &
  ColorProps &
  ColorStyleProps &
  TextStyleProps &
  LayoutProps &
  TypographyProps & {
    variant?: keyof typeof LINK_VARIANTS;
    $underline?: boolean;
    $textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  };

const SLink = Link;

const SRouterLink = styled(RouterLink)<LinkStyleProps & RouterLinkProps>`
  /** Overide @mycrypto/ui global styles */
  &&& {
    ${variant({
      variants: LINK_VARIANTS
    })}
  }

  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${layout}
  ${({
    $underline
  }) => $underline && { 'text-decoration': 'underline' }}
  ${({ $textTransform }) =>
    $textTransform && { 'text-transform': $textTransform }}
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  showIcon?: boolean;
  readonly variant?: keyof typeof LINK_VARIANTS;
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void | undefined;
}

type Props = LinkProps &
  (React.ComponentProps<typeof SLink> | React.ComponentProps<typeof SRouterLink>);

const LinkApp: FC<Props> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  onClick,
  as,
  showIcon,
  children,
  ...props
}) => {
  if (!isExternal && isUrl(href)) {
    throw new Error(
      `LinkApp: Received href prop ${href}. Set prop isExternal to use an external link.`
    );
  }
  return isExternal ? (
    <SLink
      href={href}
      variant={variant}
      target="_blank"
      onClick={onClick}
      display="inline-flex"
      sx={{ alignItems: 'center' }}
      {...props}
      // @SECURITY set last to avoid override
      rel="noreferrer"
    >
      {children}
      {showIcon && <Image src={linkOut} height="16px" width="16px" />}
    </SLink>
  ) : (
    <SRouterLink as={as} to={href} variant={variant} onClick={onClick} {...props}>
      {children}
    </SRouterLink>
  );
};

export default LinkApp;

const isUrl = (url: string) => {
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
  const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

  const match = url.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  ) {
    return true;
  }

  return false;
};
