import React from 'react';

import { Body, Box, Image, LinkApp, SubHeading } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import addAccount from '@assets/icons/add-account.svg';
import generateAccount from '@assets/icons/generate-account.svg';
import { translateRaw } from '@translations';

const MENU_ITEMS = [
  { icon: addAccount, label: translateRaw('MENU_ADD_ACCOUNT'), route: ROUTE_PATHS.ADD_ACCOUNT },
  {
    icon: generateAccount,
    label: translateRaw('MENU_GENERATE_ACCOUNT'),
    route: ROUTE_PATHS.CREATE_WALLET
  }
];

export const Menu = () => (
  <>
    <SubHeading>{translateRaw('MENU_HEADER')}</SubHeading>
    {Object.values(MENU_ITEMS).map((item, i) => (
      <LinkApp key={i} href={item.route}>
        <Box sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)' }} mb="2">
          <Box variant="rowAlign" p="3">
            <Image width="24px" height="24px" src={item.icon} mr="24px" />
            <Body color="BLUE_DARK_SLATE">{item.label}</Body>
          </Box>
        </Box>
      </LinkApp>
    ))}
  </>
);
