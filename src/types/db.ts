import { Overwrite } from 'utility-types';

export enum DBRequestType {
  LOGIN,
  GET_ACCOUNTS
}

interface BaseRequest {
  type: DBRequestType;
}

interface LoginRequest extends Overwrite<BaseRequest, { type: DBRequestType.LOGIN }> {
  password: string;
}

type GetAccountsRequest = Overwrite<BaseRequest, { type: DBRequestType.GET_ACCOUNTS }>;

export type DBRequest = LoginRequest | GetAccountsRequest;

export type DBResponse = string | boolean;
