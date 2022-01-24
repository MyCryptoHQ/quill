import { Body, Flex, Image } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import arrow from '@assets/icons/pagination-arrow.svg';

import { LinkApp } from './Core';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onNext(): void;
  onBack(): void;
}

export const Pagination = ({ page, totalPages, onNext, onBack }: PaginationProps) => (
  <Flex variant="horizontal-center" mt="2">
    {page > 0 && (
      <LinkApp data-testid="pagination-back" href="#" onClick={onBack} p="2">
        <Image src={arrow} sx={{ transform: 'rotate(180deg)' }} />
      </LinkApp>
    )}
    <Body fontSize="1" mx="4" sx={{ textTransform: 'uppercase' }}>
      {translateRaw('PAGINATION', {
        $current: (page + 1).toString(),
        $total: totalPages.toString()
      })}
    </Body>
    {page < totalPages - 1 && (
      <LinkApp data-testid="pagination-next" href="#" onClick={onNext} p="2">
        <Image src={arrow} />
      </LinkApp>
    )}
  </Flex>
);
