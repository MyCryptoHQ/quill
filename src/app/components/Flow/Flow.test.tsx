import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import type { FlowProps } from '@components';
import { Flow } from '@components';
import { theme } from '@theme';

const getComponent = (props: FlowProps) => {
  return render(
    <ThemeProvider theme={theme}>
      <Flow {...props} />
    </ThemeProvider>
  );
};

describe('Flow', () => {
  it('renders', () => {
    const { getByText } = getComponent({
      components: [
        {
          component: () => <>Foo</>
        }
      ],
      onDone: jest.fn()
    });
    expect(getByText('Foo').textContent).toBeDefined();
  });

  it('shows the current step', () => {
    const { getByText, getByTestId, getAllByTestId } = getComponent({
      components: [
        {
          component: ({ onNext }) => (
            <>
              Foo
              <button data-testid="next-button" onClick={onNext} />
            </>
          )
        },
        {
          component: () => <>Bar</>
        }
      ],
      onDone: jest.fn()
    });

    expect(getByText('Foo')).toBeDefined();
    expect(getAllByTestId('active-item')).toHaveLength(1);
    expect(getAllByTestId('item')).toHaveLength(1);

    const button = getByTestId('next-button');
    fireEvent.click(button);

    expect(getByText('Bar')).toBeDefined();
  });

  it('does nothing when calling onPrevious on the first step', () => {
    const { getByText, getByTestId } = getComponent({
      components: [
        {
          component: ({ onPrevious }) => (
            <>
              Foo
              <button data-testid="previous-button" onClick={onPrevious} />
            </>
          )
        }
      ],
      onDone: jest.fn()
    });

    const button = getByTestId('previous-button');
    fireEvent.click(button);

    expect(getByText('Foo')).toBeDefined();
  });

  it('goes to the previous step when calling onPrevious', () => {
    const { getByText, getByTestId } = getComponent({
      components: [
        {
          component: ({ onNext }) => (
            <>
              Foo
              <button data-testid="next-button" onClick={onNext} />
            </>
          )
        },
        {
          component: ({ onPrevious }) => (
            <>
              Bar
              <button data-testid="previous-button" onClick={onPrevious} />
            </>
          )
        }
      ],
      onDone: jest.fn()
    });

    const nextButton = getByTestId('next-button');
    fireEvent.click(nextButton);

    expect(getByText('Bar')).toBeDefined();

    const previousButton = getByTestId('previous-button');
    fireEvent.click(previousButton);

    expect(getByText('Foo')).toBeDefined();
  });

  it('goes to the first step when calling onReset', () => {
    const { getByText, getByTestId } = getComponent({
      components: [
        {
          component: ({ onNext }) => (
            <>
              Foo
              <button data-testid="next-button" onClick={onNext} />
            </>
          )
        },
        {
          component: ({ onReset }) => (
            <>
              Bar
              <button data-testid="reset-button" onClick={onReset} />
            </>
          )
        }
      ],
      onDone: jest.fn()
    });

    const nextButton = getByTestId('next-button');
    fireEvent.click(nextButton);

    expect(getByText('Bar')).toBeDefined();

    const resetButton = getByTestId('reset-button');
    fireEvent.click(resetButton);

    expect(getByText('Foo')).toBeDefined();
  });

  it('calls onDone when done', () => {
    const onDone = jest.fn();
    const { getByTestId } = getComponent({
      components: [
        {
          component: ({ onNext }) => (
            <>
              <button data-testid="next-button" onClick={onNext} />
            </>
          )
        }
      ],
      onDone
    });

    const button = getByTestId('next-button');
    fireEvent.click(button);

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
