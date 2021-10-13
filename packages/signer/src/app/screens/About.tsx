import type { IconType } from '@mycrypto/ui';
import { Box, Heading, Icon, IconButton, SubHeading } from '@mycrypto/ui';
import { translateRaw } from '@signer/common';
import type { FunctionComponent } from 'react';
import React from 'react';

import { Container, LinkApp } from '@components';
import { useNavigation } from '@hooks';
import { ROUTE_PATHS } from '@routing';

export const SOCIAL_LINKS: { icon: IconType; url: string }[] = [
  {
    icon: 'twitter',
    url: 'https://twitter.com/mycrypto'
  },
  {
    icon: 'facebook',
    url: 'https://www.facebook.com/mycryptoHQ/'
  },
  {
    // @todo: Different icon?
    icon: 'medium',
    url: 'https://blog.mycrypto.com/'
  },
  {
    icon: 'linkedin',
    url: 'https://www.linkedin.com/company/mycrypto'
  },
  {
    icon: 'github',
    url: 'https://github.com/MyCryptoHQ'
  },
  {
    icon: 'reddit',
    url: 'https://www.reddit.com/r/mycrypto/'
  },
  {
    icon: 'discord',
    url: 'https://discord.gg/VSaTXEA'
  }
];

export const MORE_LINKS: { text: string; icon: IconType; url: string }[] = [
  {
    text: translateRaw('OUR_TEAM'),
    icon: 'team',
    url: 'https://mycrypto.com/about'
  },
  {
    text: translateRaw('PRESS'),
    icon: 'press',
    url: 'mailto:press@mycrypto.com'
  },
  {
    text: translateRaw('PRIVACY_POLICY'),
    icon: 'lock',
    url: 'https://mycrypto.com/privacy'
  }
];

export const OTHER_PRODUCT_LINKS: { text: string; url: string }[] = [
  {
    text: 'EtherAddressLookup',
    url: ''
  },
  {
    text: 'MoneroVision',
    url: ''
  },
  {
    text: 'CryptoScamDB',
    url: ''
  },
  {
    text: 'FindETH',
    url: ''
  }
];

export const About: FunctionComponent = () => {
  useNavigation(ROUTE_PATHS.SETTINGS);

  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        {translateRaw('ABOUT_QUILL')}
      </Heading>

      <SubHeading sx={{ textTransform: 'uppercase' }} fontSize="14px">
        {translateRaw('GET_SOCIAL')}
      </SubHeading>
      <Box
        sx={{ display: 'grid', gridGap: 3, gridTemplateColumns: 'repeat(auto-fit, 38px)' }}
        mb="3"
      >
        {SOCIAL_LINKS.map(({ url, icon }) => (
          <LinkApp href={url} isExternal={true} key={url} color="#55B6E2">
            <IconButton icon={icon} fill="#55B6E2" color="#55B6E2" height="100%" />
          </LinkApp>
        ))}
      </Box>

      <SubHeading sx={{ textTransform: 'uppercase' }} fontSize="14px">
        {translateRaw('MORE_FROM_MYCRYPTO')}
      </SubHeading>
      <Box mb="1">
        {MORE_LINKS.map(({ text, url, icon }) => (
          <LinkApp href={url} isExternal={true} key={url}>
            <IconButton
              icon={icon}
              width="100%"
              mb="2"
              sx={{ '& > div': { justifyContent: 'flex-start' } }}
            >
              {text}
            </IconButton>
          </LinkApp>
        ))}
      </Box>

      <SubHeading sx={{ textTransform: 'uppercase' }} fontSize="14px">
        {translateRaw('OTHER_PRODUCTS')}
      </SubHeading>
      <Box sx={{ display: 'grid', gridGap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {OTHER_PRODUCT_LINKS.map(({ text, url }) => (
          <LinkApp href={url} isExternal={true} key={url}>
            <Icon type="help" />
            {text}
          </LinkApp>
        ))}
      </Box>
    </Container>
  );
};
