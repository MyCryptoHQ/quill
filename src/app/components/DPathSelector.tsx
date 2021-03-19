import React from 'react';

import { DPathsList } from '@data';

import { Body, Box } from '@app/components';

import Selector from './Core/Selector';

interface DPathOptionType {
  type: keyof typeof DPathsList;
  label: string;
  value: string;
}

const DPathOption = ({
  type,
  label,
  value,
  selectOption
}: {
  type: keyof typeof DPathsList;
  label: string;
  value: string;
  selectOption?(option: DPathOptionType): void;
}) => {
  const handleClick = () => selectOption && selectOption({ type, label, value });

  return (
    <Box p="2" variant="rowAlign" onClick={handleClick}>
      <Body>{label}</Body>
      <Body ml="2" fontSize="1">{`(${value})`}</Body>
    </Box>
  );
};

export const DPathSelector = ({
  selectedPath,
  setSelectedPath
}: {
  selectedPath: keyof typeof DPathsList;
  setSelectedPath(path: keyof typeof DPathsList): void;
}) => {
  const handleChange = ({ type }: DPathOptionType) => setSelectedPath(type);

  return (
    <Selector<DPathOptionType>
      value={{ type: selectedPath, ...DPathsList[selectedPath] }}
      options={Object.entries(DPathsList).map(([type, value]) => ({
        type: type as keyof typeof DPathsList,
        ...value
      }))}
      onChange={handleChange}
      searchable={false}
      optionComponent={({ data: { value, label, type }, selectOption }) => (
        <DPathOption type={type} value={value} label={label} selectOption={selectOption} />
      )}
      valueComponent={({ value: { type, value, label } }) => (
        <DPathOption type={type} value={value} label={label} />
      )}
    />
  );
};
