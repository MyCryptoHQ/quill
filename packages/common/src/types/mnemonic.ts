export interface GetMnemonicAddressArgs {
  dPath: string;
  phrase: string;
  password?: string;
}

export interface GetMnemonicAddressesArgs {
  dPathBase: string;
  phrase: string;
  password?: string;
  offset?: number;
  limit: number;
}
