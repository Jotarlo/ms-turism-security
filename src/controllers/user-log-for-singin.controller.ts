import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  LogForSingin,
} from '../models';
import {UserRepository} from '../repositories';

export class UserLogForSinginController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/log-for-singins', {
    responses: {
      '200': {
        description: 'Array of User has many LogForSingin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LogForSingin)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<LogForSingin>,
  ): Promise<LogForSingin[]> {
    return this.userRepository.logForSingins(id).find(filter);
  }

  @post('/users/{id}/log-for-singins', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(LogForSingin)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogForSingin, {
            title: 'NewLogForSinginInUser',
            exclude: ['_id'],
            optional: ['userId']
          }),
        },
      },
    }) logForSingin: Omit<LogForSingin, '_id'>,
  ): Promise<LogForSingin> {
    return this.userRepository.logForSingins(id).create(logForSingin);
  }

  @patch('/users/{id}/log-for-singins', {
    responses: {
      '200': {
        description: 'User.LogForSingin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogForSingin, {partial: true}),
        },
      },
    })
    logForSingin: Partial<LogForSingin>,
    @param.query.object('where', getWhereSchemaFor(LogForSingin)) where?: Where<LogForSingin>,
  ): Promise<Count> {
    return this.userRepository.logForSingins(id).patch(logForSingin, where);
  }

  @del('/users/{id}/log-for-singins', {
    responses: {
      '200': {
        description: 'User.LogForSingin DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(LogForSingin)) where?: Where<LogForSingin>,
  ): Promise<Count> {
    return this.userRepository.logForSingins(id).delete(where);
  }
}
