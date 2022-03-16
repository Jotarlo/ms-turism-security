import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDsDataSource} from '../datasources';
import {TwoFactorAuthenticationCode, TwoFactorAuthenticationCodeRelations} from '../models';

export class TwoFactorAuthenticationCodeRepository extends DefaultCrudRepository<
  TwoFactorAuthenticationCode,
  typeof TwoFactorAuthenticationCode.prototype._id,
  TwoFactorAuthenticationCodeRelations
> {
  constructor(
    @inject('datasources.mongodbDS') dataSource: MongodbDsDataSource,
  ) {
    super(TwoFactorAuthenticationCode, dataSource);
  }
}
