export class ProviderRpcError extends Error {
  constructor(public message: string, public code: number, public data?: unknown) {
    super(message);
  }
}

export interface RequestArguments {
  readonly method: string;
  readonly params?: unknown[] | Record<string, unknown>;
}

export interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

export interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}

/**
 * Used to strictly type provider events, without code duplication.
 */
interface ProviderEvents {
  message(data: EthSubscription): void;
  connect(data: ProviderConnectInfo): void;
  disconnect(error: ProviderRpcError): void;
  chainChanged(chainId: string): void;
  accountsChanged(accounts: string[]): void;
}

/**
 * Interface for an EIP-1193 compatible provider.
 */
export interface Provider {
  /**
   * A flag that can be used to distinguish the provider from other providers. This is not specified by EIP-1193.
   */
  isMyCrypto?: boolean;

  /**
   * The `request` method is intended as a transport- and protocol-agnostic wrapper function for Remote Procedure Calls
   * (RPCs). May reject with a `ProviderRpcError` if the RPC request fails, or if the provider fails to process the
   * request for any reason.
   *
   * @param args The request arguments.
   * @returns A result as per the RPC method's specification.
   */
  request(args: RequestArguments): Promise<unknown>;

  on<Event extends keyof ProviderEvents>(event: Event, listener: ProviderEvents[Event]): this;
  once<Event extends keyof ProviderEvents>(event: Event, listener: ProviderEvents[Event]): this;
  emit<Event extends keyof ProviderEvents>(
    event: Event,
    ...args: Parameters<ProviderEvents[Event]>
  ): boolean;
}
