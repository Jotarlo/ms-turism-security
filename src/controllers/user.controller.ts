import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  ChangePassword,
  ResetPassword,
  TwoFactorAuthenticationCode,
  User,
  UserAuthenticationCredentials,
} from '../models';
import {
  TwoFactorAuthenticationCodeRepository,
  UserRepository,
} from '../repositories';
import {SecurityService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(TwoFactorAuthenticationCodeRepository)
    public twoFactorAUthenticationCodeRepository: TwoFactorAuthenticationCodeRepository,
    @service(SecurityService)
    public securityService: SecurityService,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    var generatedPassword = this.securityService.GeneratePassword(
      10,
      true,
      true,
      true,
    );
    let cryptedPassword = this.securityService.CryptPassword(generatedPassword);
    user.password = cryptedPassword;
    // Notificar contraseña al usuario
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  // own methods

  @post('/user-authentication')
  @response(200, {
    description: 'Identification of users',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserAuthenticationCredentials),
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserAuthenticationCredentials, {
            title: 'User Login',
          }),
        },
      },
    })
    credentials: UserAuthenticationCredentials,
  ): Promise<User | null> {
    let user = await this.userRepository.findOne({
      where: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    if (user) {
      var generatatedCode = this.securityService.GeneratePassword(6);
      console.log(generatatedCode);
      let twoFACode = {
        code: generatatedCode,
        userId: user._id,
      };
      this.twoFactorAUthenticationCodeRepository.create(twoFACode);
      // Enviar código al usuario
      user.password = '';
      return user;
    } else {
      throw new HttpErrors[401]('Las credenciales no son correctas.');
    }
  }

  @post('/two-factor-authentication')
  @response(200, {
    description: 'Identification of users throught 2fa',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TwoFactorAuthenticationCode),
      },
    },
  })
  async TwoFACodeVerification(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwoFactorAuthenticationCode, {
            title: '2fa',
            exclude: ['_id'],
          }),
        },
      },
    })
    codeData: Omit<TwoFactorAuthenticationCode, '_id'>,
  ): Promise<string> {
    let isValid = await this.twoFactorAUthenticationCodeRepository.findOne({
      where: {
        userId: codeData.userId,
        code: codeData.code,
        status: false,
      },
    });
    if (isValid) {
      this.twoFactorAUthenticationCodeRepository.updateById(isValid._id, {
        status: true,
      });
      // generar el token de jwt
      let user = await this.userRepository.findById(codeData.userId);
      let token = this.securityService.CreateTokenJWT(user);
      return token;
    } else {
      throw new HttpErrors[401]('Invalid code');
    }
  }

  @post('/change-password')
  @response(200, {
    description: 'Change password of users',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ChangePassword),
      },
    },
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangePassword, {
            title: 'Change Password',
          }),
        },
      },
    })
    credentials: ChangePassword,
  ): Promise<boolean> {
    let user = await this.userRepository.findOne({
      where: {
        _id: credentials.userId,
        password: credentials.currentPassword,
      },
    });
    if (user) {
      user.password = credentials.newPassword;
      this.userRepository.update(user);
      // notificar al correo del usuario que se ha cambiado la contraseña
      return true;
    } else {
      throw new HttpErrors[403]('La contraseña actual no es correcta.');
    }
  }

  @post('/reset-password')
  @response(200, {
    description: 'Reset password of users',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ResetPassword),
      },
    },
  })
  // 9e3079fd68a6efcb6ebc3c86f7a877c9
  // 7eb3c6ce82745a88d33d22decb4c5b19
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResetPassword, {
            title: 'Reset Password',
          }),
        },
      },
    })
    credentials: ResetPassword,
  ): Promise<boolean> {
    let user = await this.userRepository.findOne({
      where: {
        username: credentials.username,
        email: credentials.email,
      },
    });
    if (user) {
      let newPassword = this.securityService.GeneratePassword(
        10,
        true,
        true,
        true,
      );
      console.log(newPassword);

      let cryptedPassword = this.securityService.CryptPassword(newPassword);
      user.password = cryptedPassword;
      this.userRepository.update(user);
      // notificar al correo del usuario la contraseña
      return true;
    } else {
      throw new HttpErrors[403]('La contraseña actual no es correcta.');
    }
  }
}
