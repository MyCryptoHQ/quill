import React from 'react';

import makeBlockie from 'ethereum-blockies-base64';

import { Image, ImageProps } from '@app/components';
import { TAddress } from '@types';

export const Blockie = ({ address, ...props }: { address: TAddress } & ImageProps) => (
  <Image src={makeBlockie(address)} variant="avatar" {...props} />
);
