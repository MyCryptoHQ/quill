import { TUuid } from './uuid';

export enum SecretsRequestType {
  SAVE_PRIVATE_KEY = 'SAVE_PRIVATE_KEY',
  GET_PRIVATE_KEY = 'GET_PRIVATE_KEY',
  DELETE_PRIVATE_KEY = 'DELETE_PRIVATE_KEY'
}

interface BaseRequest<Type extends SecretsRequestType> {
  type: Type;
  uuid: TUuid;
}

interface PasswordRequest<Type extends SecretsRequestType> extends BaseRequest<Type> {
  password: string;
}

interface SavePrivateKeyRequest extends PasswordRequest<SecretsRequestType.SAVE_PRIVATE_KEY> {
  privateKey: string;
}

type GetPrivateKeyRequest = PasswordRequest<SecretsRequestType.GET_PRIVATE_KEY>;

type DeletePrivateKeyRequest = BaseRequest<SecretsRequestType.DELETE_PRIVATE_KEY>;

export type SecretsRequest = SavePrivateKeyRequest | GetPrivateKeyRequest | DeletePrivateKeyRequest;

export type SecretsResponse = string | void | boolean;
