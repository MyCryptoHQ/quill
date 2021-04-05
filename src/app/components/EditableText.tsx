import React, { useEffect, useState } from 'react';

import edit from '@assets/icons/edit.svg';

import { Box, BoxProps, Image, Input } from '.';
import { Body } from './Typography';

export const EditableText = ({
  value,
  onChange,
  placeholder,
  ...props
}: { value: string; placeholder?: string; onChange(value: string): void } & Omit<
  BoxProps,
  'onChange'
>) => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleKeyDown = ({ key }: { key: string }) => {
    if (key === 'Escape') {
      handleCancel();
    } else if (key === 'Enter') {
      handleSave();
    }
  };

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditValue(value);
  };

  const handleSave = () => {
    onChange(editValue);
    setEditMode(false);
  };

  const hasValue = value !== undefined;

  return (
    <Box variant="rowAlign" height="100%" {...props}>
      {editMode ? (
        <Input
          placeholder={placeholder}
          autoFocus={true}
          value={editValue}
          onChange={(e) => setEditValue(e.currentTarget.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          p="1"
          sx={{ width: 'auto' }}
        />
      ) : (
        <>
          <Body
            as="span"
            onClick={handleEdit}
            sx={{
              borderBottomWidth: '1px',
              borderBottomColor: 'transparent',
              borderBottomStyle: 'solid',
              '&:hover': {
                borderBottomWidth: '1px',
                borderBottomColor: 'BLUE_GREY',
                borderBottomStyle: 'dashed',
                cursor: 'pointer'
              }
            }}
          >
            {hasValue ? value : placeholder}
          </Body>
          <Image
            src={edit}
            onClick={handleEdit}
            ml="2"
            height="16px"
            width="16px"
            sx={{ '&:hover': { cursor: 'pointer' } }}
          />
        </>
      )}
    </Box>
  );
};
