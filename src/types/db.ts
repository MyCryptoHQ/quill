import { AccountsState } from '@app/store/account';
import { TUuid } from '@types';

export enum DBRequestType {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  RESET = 'RESET',
  IS_NEW_USER = 'IS_NEW_USER',
  IS_LOGGED_IN = 'IS_LOGGED_IN',
  GET_ACCOUNTS = 'GET_ACCOUNTS',
  SET_ACCOUNTS = 'SET_ACCOUNTS',
  SAVE_PRIVATE_KEY = 'SAVE_PRIVATE_KEY',
  GET_PRIVATE_KEY = 'GET_PRIVATE_KEY',
  DELETE_PRIVATE_KEY = 'DELETE_PRIVATE_KEY'
}

interface BaseRequest<Type extends DBRequestType> {
  type: Type;
}

interface PasswordRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  password: string;
}

type InitRequest = PasswordRequest<DBRequestType.INIT>;

type LoginRequest = PasswordRequest<DBRequestType.LOGIN>;

type ResetRequest = BaseRequest<DBRequestType.RESET>;

type GetLoginStateRequest = BaseRequest<DBRequestType.IS_LOGGED_IN>;

type GetNewUserStateRequest = BaseRequest<DBRequestType.IS_NEW_USER>;

type GetAccountsRequest = BaseRequest<DBRequestType.GET_ACCOUNTS>;

interface SetAccountsRequest extends BaseRequest<DBRequestType.SET_ACCOUNTS> {
  accounts: AccountsState;
}

interface UuidRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  uuid: TUuid;
}

interface SavePrivateKeyRequest extends UuidRequest<DBRequestType.SAVE_PRIVATE_KEY> {
  privateKey: string;
}

type GetPrivateKeyRequest = UuidRequest<DBRequestType.GET_PRIVATE_KEY>;

type DeletePrivateKeyRequest = UuidRequest<DBRequestType.DELETE_PRIVATE_KEY>;

export type DBRequest =
  | InitRequest
  | LoginRequest
  | ResetRequest
  | GetLoginStateRequest
  | GetNewUserStateRequest
  | GetAccountsRequest
  | SetAccountsRequest
  | SavePrivateKeyRequest
  | GetPrivateKeyRequest
  | DeletePrivateKeyRequest;

export type DBResponse = string | boolean | AccountsState | void;
