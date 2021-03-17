import React from 'react';

import { Body, Box } from '@app/components';
import { translateRaw } from '@translations';

export const FileBox = ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) => (
  <Box
    bg="BG_GREY_MUTED"
    p="2"
    sx={{
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'GREY_ATHENS',
      boxShadow: '0px 1px 1px rgba(232, 234, 237, 0.5), inset 0px 1px 3px rgba(232, 234, 237, 0.5)',
      borderRadius: '6px'
    }}
    // @todo Fix OnDrop
    //onDrop={() => console.log('drop')}
  >
    <Box
      p="5"
      sx={{
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: 'GREY_ATHENS',
        textAlign: 'center',
        borderRadius: '5px'
      }}
    >
      <label htmlFor="upload">
        <input
          data-testid="file-upload"
          id="upload"
          onChange={onChange}
          type="file"
          style={{ display: 'none' }}
        />
        <Body as="span" color="LIGHT_BLUE" sx={{ '&:hover': { cursor: 'pointer' } }}>
          {translateRaw('KEYSTORE_UPLOAD_PART1')}
        </Body>
      </label>{' '}
      {translateRaw('KEYSTORE_UPLOAD_PART2')}
    </Box>
  </Box>
);
