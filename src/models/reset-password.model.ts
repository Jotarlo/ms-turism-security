import {Model, model, property} from '@loopback/repository';

@model()
export class ResetPassword extends Model {
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


  constructor(data?: Partial<ResetPassword>) {
    super(data);
  }
}

export interface ResetPasswordRelations {
  // describe navigational properties here
}

export type ResetPasswordWithRelations = ResetPassword & ResetPasswordRelations;
