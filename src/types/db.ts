import { IAccount } from './account';

export enum DBRequestType {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  GET_LOGIN_STATE = 'GET_LOGIN_STATE',
  GET_ACCOUNTS = 'GET_ACCOUNTS'
}

export enum LoginState {
  NEW_USER = 'NEW_USER',
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT'
}

interface BaseRequest<Type extends DBRequestType> {
  type: Type;
}

interface PasswordRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  password: string;
}

type InitRequest = PasswordRequest<DBRequestType.INIT>;

type LoginRequest = PasswordRequest<DBRequestType.LOGIN>;

type GetLoginStateRequest = BaseRequest<DBRequestType.GET_LOGIN_STATE>;

type GetAccountsRequest = BaseRequest<DBRequestType.GET_ACCOUNTS>;

export type DBRequest = InitRequest | LoginRequest | GetLoginStateRequest | GetAccountsRequest;

export type DBResponse = string | boolean | LoginState | IAccount[];
