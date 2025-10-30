import { IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';

export enum PeriodType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class DashboardFiltersDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(PeriodType)
  period?: PeriodType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  envelopeId?: string;
}
