import { FC } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Link } from 'rebass/styled-components';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontStyle,
  FontStyleProps,
  layout,
  LayoutProps,
  lineHeight,
  LineHeightProps,
  size,
  SizeProps,
  space,
  SpaceProps,
  textStyle,
  TextStyleProps,
  typography,
  TypographyProps,
  variant
} from 'styled-system';

import { LINK_VARIANTS } from '@app/theme';

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
      {...props}
      // @SECURITY set last to avoid override
      rel="noreferrer"
    />
  ) : (
    <SRouterLink as={as} to={href} variant={variant} onClick={onClick} {...props} />
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
