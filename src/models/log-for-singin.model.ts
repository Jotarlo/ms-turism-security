import {Entity, model, property} from '@loopback/repository';

@model()
export class LogForSingin extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'date',
    required: true,
  })
  datetime: string;

  @property({
    type: 'string',
  })
  ipAddress?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<LogForSingin>) {
    super(data);
  }
}

export interface LogForSinginRelations {
  // describe navigational properties here
}

export type LogForSinginWithRelations = LogForSingin & LogForSinginRelations;
