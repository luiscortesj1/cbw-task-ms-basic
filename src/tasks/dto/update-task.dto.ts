import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @IsNumber()
  @IsPositive()
  id: number;


}
