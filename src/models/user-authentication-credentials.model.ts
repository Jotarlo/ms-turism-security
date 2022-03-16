import {Model, model, property} from '@loopback/repository';

@model()
export class UserAuthenticationCredentials extends Model {
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<UserAuthenticationCredentials>) {
    super(data);
  }
}

export interface UserAuthenticationCredentialsRelations {
  // describe navigational properties here
}

export type UserAuthenticationCredentialsWithRelations = UserAuthenticationCredentials & UserAuthenticationCredentialsRelations;
