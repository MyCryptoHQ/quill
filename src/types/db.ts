import { TUuid } from '@types';

import { IAccount } from './account';

export enum DBRequestType {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  RESET = 'RESET',
  IS_NEW_USER = 'IS_NEW_USER',
  IS_LOGGED_IN = 'IS_LOGGED_IN',
  GET_FROM_STORE = 'GET_FROM_STORE',
  SET_IN_STORE = 'SET_IN_STORE',
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

interface GetFromStoreRequest extends BaseRequest<DBRequestType.GET_FROM_STORE> {
  key: string;
}

interface SetInStoreRequest extends BaseRequest<DBRequestType.SET_IN_STORE> {
  key: string;
  payload: any;
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
  | GetFromStoreRequest
  | SetInStoreRequest
  | SavePrivateKeyRequest
  | GetPrivateKeyRequest
  | DeletePrivateKeyRequest;

export type DBResponse = string | boolean | IAccount[] | void;
