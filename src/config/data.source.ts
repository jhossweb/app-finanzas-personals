import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({
    envFilePath: `${process.env.NODE_ENV === 'develop' ? '.develop.env' : '.env'}`,
})

const config = new ConfigService()

export const DataSourceConfig: DataSourceOptions = {
    type: 'sqlite',
    database: config.get<string>('DATABASE') || 'databases/database.db',
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../databases/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    migrationsRun: true,
    migrationsTableName: 'migrations',
}

export const AppDS = new DataSource(DataSourceConfig);