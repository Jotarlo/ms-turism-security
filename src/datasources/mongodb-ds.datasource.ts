import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongodbDS',
  connector: 'mongodb',
  url: (process.env.CONN_STRING_MONGODB ?? ''),
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'turismSecurityDB',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodbDS';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodbDS', {optional: true})
    dsConfig: object = config,
  ) {
    //console.log(process.env.CONN_STRING_MONGODB)
    super(dsConfig);
  }
}
