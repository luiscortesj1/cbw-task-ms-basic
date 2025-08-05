import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  readonly status?: 'pending' | 'in_progress' | 'completed';

  @IsOptional()
  @IsString()
  readonly assigned_to?: string;

  @IsOptional()
  @IsDateString()
  readonly due_date?: Date;
}
