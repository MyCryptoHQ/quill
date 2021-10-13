import type { IconType } from '@mycrypto/ui';
import { Body, Box, Flex, Heading, Icon, IconButton, SubHeading } from '@mycrypto/ui';
import { translateRaw } from '@signer/common';
import type { FunctionComponent } from 'react';

import { Container, LinkApp } from '@components';
import { useNavigation } from '@hooks';
import { ROUTE_PATHS } from '@routing';

import { version } from '../../../package.json';

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
    url:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn'
  },
  {
    text: 'MoneroVision',
    url: 'https://monerovision.com/'
  },
  {
    text: 'CryptoScamDB',
    url: 'https://cryptoscamdb.org/'
  },
  {
    text: 'FindETH',
    url: 'https://findeth.io/'
  }
];

export const About: FunctionComponent = () => {
  useNavigation(ROUTE_PATHS.SETTINGS);

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading fontSize="24px" lineHeight="150%" mb="1">
          {translateRaw('ABOUT_QUILL')}
        </Heading>
        <Body fontSize="10px" fontWeight="bold">
          v{version}
        </Body>
      </Flex>

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
          <LinkApp href={url} isExternal={true} key={url} mb="1">
            <Icon type="external" width="22px" verticalAlign="middle" mr="2" />
            {text}
          </LinkApp>
        ))}
      </Box>
    </Container>
  );
};
