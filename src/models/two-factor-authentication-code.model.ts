import {Entity, model, property} from '@loopback/repository';

@model()
export class TwoFactorAuthenticationCode extends Entity {
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
  code: string;

  @property({
    type: 'boolean',
    default: false,
  })
  status?: boolean;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<TwoFactorAuthenticationCode>) {
    super(data);
  }
}

export interface TwoFactorAuthenticationCodeRelations {
  // describe navigational properties here
}

export type TwoFactorAuthenticationCodeWithRelations =
  TwoFactorAuthenticationCode & TwoFactorAuthenticationCodeRelations;
