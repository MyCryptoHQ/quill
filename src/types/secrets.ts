import { TUuid } from './uuid';

export enum SecretsRequestType {
  SET_ENCRYPTION_KEY = 'SET_ENCRYPTION_KEY',
  SAVE_PRIVATE_KEY = 'SAVE_PRIVATE_KEY',
  GET_PRIVATE_KEY = 'GET_PRIVATE_KEY',
  DELETE_PRIVATE_KEY = 'DELETE_PRIVATE_KEY'
}

interface BaseRequest<Type extends SecretsRequestType> {
  type: Type;
}

interface UuidRequest<Type extends SecretsRequestType> extends BaseRequest<Type> {
  uuid: TUuid;
}

interface SetEncryptionKeyRequest extends BaseRequest<SecretsRequestType.SET_ENCRYPTION_KEY> {
  encryptionKey: string;
}

interface SavePrivateKeyRequest extends UuidRequest<SecretsRequestType.SAVE_PRIVATE_KEY> {
  privateKey: string;
}

type GetPrivateKeyRequest = UuidRequest<SecretsRequestType.GET_PRIVATE_KEY>;

type DeletePrivateKeyRequest = UuidRequest<SecretsRequestType.DELETE_PRIVATE_KEY>;

export type SecretsRequest =
  | SetEncryptionKeyRequest
  | SavePrivateKeyRequest
  | GetPrivateKeyRequest
  | DeletePrivateKeyRequest;

export type SecretsResponse = string | void | boolean;
