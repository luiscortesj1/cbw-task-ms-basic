import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { envs } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    MongooseModule.forRoot(envs.databaseUrl),
    BullModule.forRoot({
      redis: {
        host: envs.redisHost,
        port: envs.redisPort,
      },
    }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
