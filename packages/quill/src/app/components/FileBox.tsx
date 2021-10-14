import { Body } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import type { ChangeEvent, DragEvent } from 'react';
import { useState } from 'react';

import type { BoxProps } from '@app/components';
import { Box, Image } from '@app/components';
import checkmark from '@assets/icons/circle-checkmark.svg';

export const FileBox = ({
  onChange,
  error,
  ...props
}: { onChange(file: File): void; error?: boolean } & Omit<BoxProps, 'onChange'>) => {
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  // Needs to be set for onDrop to work
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(e.dataTransfer.files[0].name);
    onChange(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.currentTarget.files[0].name);
    onChange(e.currentTarget.files[0]);
  };

  return (
    <Box
      bg="BG_GREY_MUTED"
      p="2"
      sx={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: error ? 'RED' : 'GREY_ATHENS',
        boxShadow:
          '0px 1px 1px rgba(232, 234, 237, 0.5), inset 0px 1px 3px rgba(232, 234, 237, 0.5)',
        borderRadius: '6px'
      }}
      {...props}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Box
        p="60px"
        sx={{
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: 'GREY_ATHENS',
          textAlign: 'center',
          borderRadius: '5px'
        }}
      >
        {fileName && (
          <Box variant="horizontal-center" mb="2">
            <Image src={checkmark} minWidth="16px" width="16px" height="16px" mr="2" />
            <Body sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{fileName}</Body>
          </Box>
        )}
        <label htmlFor="upload">
          <input
            data-testid="file-upload"
            id="upload"
            onChange={handleChange}
            type="file"
            style={{ display: 'none' }}
          />
          <Body as="span" color="LIGHT_BLUE" sx={{ '&:hover': { cursor: 'pointer' } }}>
            {translateRaw('KEYSTORE_UPLOAD_PART1')}
          </Body>
        </label>{' '}
        <Body as="span" color={fileName ? 'BLUE_GREY' : 'BODY'}>
          {translateRaw('KEYSTORE_UPLOAD_PART2')}{' '}
          {fileName && translateRaw('KEYSTORE_UPLOAD_PART3')}
        </Body>
      </Box>
    </Box>
  );
};
