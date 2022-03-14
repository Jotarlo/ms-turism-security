import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDsDataSource} from '../datasources';
import {LogForSingin, LogForSinginRelations} from '../models';

export class LogForSinginRepository extends DefaultCrudRepository<
  LogForSingin,
  typeof LogForSingin.prototype._id,
  LogForSinginRelations
> {
  constructor(
    @inject('datasources.mongodbDS') dataSource: MongodbDsDataSource,
  ) {
    super(LogForSingin, dataSource);
  }
}
