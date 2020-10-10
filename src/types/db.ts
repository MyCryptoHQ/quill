import { AccountsState } from '@app/store/account';

export enum DBRequestType {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  IS_NEW_USER = 'IS_NEW_USER',
  IS_LOGGED_IN = 'IS_LOGGED_IN',
  GET_ACCOUNTS = 'GET_ACCOUNTS',
  SET_ACCOUNTS = 'SET_ACCOUNTS'
}

interface BaseRequest<Type extends DBRequestType> {
  type: Type;
}

interface PasswordRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  password: string;
}

type InitRequest = PasswordRequest<DBRequestType.INIT>;

type LoginRequest = PasswordRequest<DBRequestType.LOGIN>;

type GetLoginStateRequest = BaseRequest<DBRequestType.IS_LOGGED_IN>;

type GetNewUserStateRequest = BaseRequest<DBRequestType.IS_NEW_USER>;

type GetAccountsRequest = BaseRequest<DBRequestType.GET_ACCOUNTS>;

interface SetAccountsRequest extends BaseRequest<DBRequestType.SET_ACCOUNTS> {
  accounts: AccountsState;
}

export type DBRequest =
  | InitRequest
  | LoginRequest
  | GetLoginStateRequest
  | GetNewUserStateRequest
  | GetAccountsRequest
  | SetAccountsRequest;

export type DBResponse = string | boolean | AccountsState | void;
