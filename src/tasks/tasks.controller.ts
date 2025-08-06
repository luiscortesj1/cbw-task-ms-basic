import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PatchTaskDto } from './dto/patch-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Payload } from '@nestjs/microservices';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    @InjectQueue('tasks-queue') private readonly tasksQueue: Queue,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Task>> {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, body);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() patchTaskDto: PatchTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, patchTaskDto);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: TaskStatus): Promise<Task[]> {
    return this.tasksService.findByStatus(status);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/schedule')
  async schedule(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: { runAt: Date },
  ) {
    const delay = new Date(body.runAt).getTime() - Date.now();
    return this.tasksQueue.add('notify', { taskId: id }, { delay });
  }
}
