import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }


  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }


  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true, runValidators: true })
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return updatedTask;
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await this.taskModel.find({ status }).exec();
    if (tasks.length === 0) {
      throw new NotFoundException(`No tasks found with status ${status}`);
    }
    return tasks;
  }



  async remove(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return deletedTask;
  }
}
