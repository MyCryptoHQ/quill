import { SubHeading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

import error from '@assets/icons/circle-error.svg';

import { Container } from './Container';
import { Logo } from './Logo';

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
          <Logo width="100px" height="100px" icon={error} fillIcon={false} mx="auto" />
          <SubHeading textAlign="center">{translateRaw('SOMETHING_WENT_WRONG')}</SubHeading>
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
