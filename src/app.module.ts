import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { envs } from './config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(envs.databaseUrl),
    TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
