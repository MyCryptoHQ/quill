import { Body } from '@mycrypto/ui';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import edit from '@assets/icons/edit.svg';

import type { BoxProps } from './index';
import { Box, Image, Input } from './index';

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
    setEditValue(value ?? '');
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
    onChange(editValue.length > 0 ? editValue : undefined);
    setEditMode(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setEditValue(e.currentTarget.value);

  const hasValue = value !== undefined;

  return (
    <Box variant="horizontal-start" height="100%" {...props}>
      {editMode ? (
        <Input
          placeholder={placeholder}
          autoFocus={true}
          value={editValue}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          p="1"
          fontSize="3"
          sx={{ width: 'auto' }}
        />
      ) : (
        <>
          <Body
            as="span"
            onClick={handleEdit}
            fontSize="3"
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
