import { Overwrite } from 'utility-types';

export enum DBRequestType {
  INIT,
  LOGIN,
  GET_LOGIN_STATE,
  GET_ACCOUNTS
}

export enum LoginState {
  NEW_USER,
  LOGGED_IN,
  LOGGED_OUT
}

interface BaseRequest {
  type: DBRequestType;
}

type InitRequest = Overwrite<LoginRequest, { type: DBRequestType.INIT }>;

interface LoginRequest extends Overwrite<BaseRequest, { type: DBRequestType.LOGIN }> {
  password: string;
}

type GetLoginStateRequest = Overwrite<BaseRequest, { type: DBRequestType.GET_LOGIN_STATE }>;

type GetAccountsRequest = Overwrite<BaseRequest, { type: DBRequestType.GET_ACCOUNTS }>;

export type DBRequest = InitRequest | LoginRequest | GetLoginStateRequest | GetAccountsRequest;

export type DBResponse = string | boolean;
