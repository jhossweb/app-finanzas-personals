import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';
import { CategoryEntity } from '@/categories/entities/category.entity';
import { EnvelopeEnity } from '@/envelopes/entities/envelope.entity';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {

    @IsOptional()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    amount?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUUID()
    category_id?: CategoryEntity;

    @IsString()
    @IsUUID()
    envelope_id?: EnvelopeEnity;

}
