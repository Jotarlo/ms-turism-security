import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDsDataSource} from '../datasources';
import {User, UserRelations, Role, LogForSingin, TwoFactorAuthenticationCode} from '../models';
import {RoleRepository} from './role.repository';
import {LogForSinginRepository} from './log-for-singin.repository';
import {TwoFactorAuthenticationCodeRepository} from './two-factor-authentication-code.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof User.prototype._id>;

  public readonly logForSingins: HasManyRepositoryFactory<LogForSingin, typeof User.prototype._id>;

  public readonly twoFactorAuthenticationCodes: HasManyRepositoryFactory<TwoFactorAuthenticationCode, typeof User.prototype._id>;

  constructor(
    @inject('datasources.mongodbDS') dataSource: MongodbDsDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('LogForSinginRepository') protected logForSinginRepositoryGetter: Getter<LogForSinginRepository>, @repository.getter('TwoFactorAuthenticationCodeRepository') protected twoFactorAuthenticationCodeRepositoryGetter: Getter<TwoFactorAuthenticationCodeRepository>,
  ) {
    super(User, dataSource);
    this.twoFactorAuthenticationCodes = this.createHasManyRepositoryFactoryFor('twoFactorAuthenticationCodes', twoFactorAuthenticationCodeRepositoryGetter,);
    this.registerInclusionResolver('twoFactorAuthenticationCodes', this.twoFactorAuthenticationCodes.inclusionResolver);
    this.logForSingins = this.createHasManyRepositoryFactoryFor('logForSingins', logForSinginRepositoryGetter,);
    this.registerInclusionResolver('logForSingins', this.logForSingins.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
