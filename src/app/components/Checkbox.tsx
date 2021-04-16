import checkmark from '@app/assets/icons/checkmark.svg';
import type { BoxProps } from '@app/components';
import { Box, Image } from '@app/components';

// Because Rebass Checkbox is currently broken... https://github.com/rebassjs/rebass/issues/1049
export const Checkbox = ({ onChange, checked, ...props }: BoxProps) => (
  <Box
    variant="horizontal-start"
    sx={{
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'GREY_LIGHTER',
      boxShadow: 'inset 0px 1px 1px rgba(63, 63, 68, 0.05)',
      borderRadius: '2px',
      cursor: 'pointer',
      width: '20px',
      height: '20px',
      justifyContent: 'center',
      userSelect: 'none'
    }}
    {...props}
    onClick={onChange}
  >
    {checked && <Image src={checkmark} width="10px" height="10px" />}
  </Box>
);
