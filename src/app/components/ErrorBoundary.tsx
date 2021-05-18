import { Heading } from '@mycrypto/ui';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

import { translateRaw } from '@common/translate';

import { Container } from './Container';

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  Props,
  { error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Container>
          <Heading as="h2" fontSize="1.5rem">
            {translateRaw('SOMETHING_WENT_WRONG')}
          </Heading>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </Container>
      );
    }
    return this.props.children;
  }
}
