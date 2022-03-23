import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {LogForSingin} from './log-for-singin.model';
import {Role} from './role.model';
import {TwoFactorAuthenticationCode} from './two-factor-authentication-code.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  fullname: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  cellphone: string;

  @property({
    type: 'string',
  })
  password: string;

  @belongsTo(() => Role)
  roleId: string;

  @hasMany(() => LogForSingin)
  logForSingins: LogForSingin[];

  @hasMany(() => TwoFactorAuthenticationCode)
  twoFactorAuthenticationCodes: TwoFactorAuthenticationCode[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
