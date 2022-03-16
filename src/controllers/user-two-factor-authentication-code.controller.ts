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
  TwoFactorAuthenticationCode,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTwoFactorAuthenticationCodeController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/two-factor-authentication-codes', {
    responses: {
      '200': {
        description: 'Array of User has many TwoFactorAuthenticationCode',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TwoFactorAuthenticationCode)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TwoFactorAuthenticationCode>,
  ): Promise<TwoFactorAuthenticationCode[]> {
    return this.userRepository.twoFactorAuthenticationCodes(id).find(filter);
  }

  @post('/users/{id}/two-factor-authentication-codes', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(TwoFactorAuthenticationCode)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwoFactorAuthenticationCode, {
            title: 'NewTwoFactorAuthenticationCodeInUser',
            exclude: ['_id'],
            optional: ['userId']
          }),
        },
      },
    }) twoFactorAuthenticationCode: Omit<TwoFactorAuthenticationCode, '_id'>,
  ): Promise<TwoFactorAuthenticationCode> {
    return this.userRepository.twoFactorAuthenticationCodes(id).create(twoFactorAuthenticationCode);
  }

  @patch('/users/{id}/two-factor-authentication-codes', {
    responses: {
      '200': {
        description: 'User.TwoFactorAuthenticationCode PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwoFactorAuthenticationCode, {partial: true}),
        },
      },
    })
    twoFactorAuthenticationCode: Partial<TwoFactorAuthenticationCode>,
    @param.query.object('where', getWhereSchemaFor(TwoFactorAuthenticationCode)) where?: Where<TwoFactorAuthenticationCode>,
  ): Promise<Count> {
    return this.userRepository.twoFactorAuthenticationCodes(id).patch(twoFactorAuthenticationCode, where);
  }

  @del('/users/{id}/two-factor-authentication-codes', {
    responses: {
      '200': {
        description: 'User.TwoFactorAuthenticationCode DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TwoFactorAuthenticationCode)) where?: Where<TwoFactorAuthenticationCode>,
  ): Promise<Count> {
    return this.userRepository.twoFactorAuthenticationCodes(id).delete(where);
  }
}
