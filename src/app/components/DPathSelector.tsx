import { Body } from '@mycrypto/ui';
import { ALL_DERIVATION_PATHS, DerivationPath } from '@mycrypto/wallets';

import { Box } from '@app/components';

import Selector from './Core/Selector';

interface DPathOptionType {
  name: string;
  path: string;
  isHardened: boolean;
}

const DPathOption = ({
  name,
  path,
  isHardened,
  selectOption
}: {
  name: string;
  path: string;
  isHardened: boolean;
  selectOption?(option: DPathOptionType): void;
}) => {
  const handleClick = () => selectOption && selectOption({ name, path, isHardened });

  return (
    <Box p="2" variant="horizontal-start" data-testid={`select-${name}`} onClick={handleClick}>
      <Body>{name}</Body>
      <Body ml="2" fontSize="1">{`(${path})`}</Body>
    </Box>
  );
};

export const DPathSelector = ({
  selectedPath,
  setSelectedPath
}: {
  selectedPath: DerivationPath['name'];
  setSelectedPath(path: DerivationPath['name']): void;
}) => {
  const handleChange = ({ name }: DPathOptionType) => setSelectedPath(name);

  const selectedPathData = ALL_DERIVATION_PATHS.find((p) => p.name === selectedPath);

  return (
    <Selector<DPathOptionType>
      value={{ ...selectedPathData, isHardened: selectedPathData.isHardened || false }}
      options={Object.values(ALL_DERIVATION_PATHS).map((p) => ({
        ...p,
        isHardened: selectedPathData.isHardened || false
      }))}
      onChange={handleChange}
      searchable={false}
      optionComponent={({ data, selectOption }) => (
        <DPathOption {...data} selectOption={selectOption} />
      )}
      valueComponent={({ value }) => <DPathOption {...value} />}
    />
  );
};
