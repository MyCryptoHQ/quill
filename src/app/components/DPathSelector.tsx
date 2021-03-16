import React, { ChangeEventHandler } from 'react';

import { DPathsList } from '@data';

import { Select } from '@app/components';

export const DPathSelector = ({
  selectedPath,
  setSelectedPath
}: {
  selectedPath: string;
  setSelectedPath: ChangeEventHandler<HTMLSelectElement>;
}) => (
  <Select onChange={setSelectedPath}>
    {Object.entries(DPathsList).map(([key, dpath]) => (
      <option key={key} value={key} selected={key === selectedPath}>
        {dpath.label} {dpath.value}
      </option>
    ))}
  </Select>
);
