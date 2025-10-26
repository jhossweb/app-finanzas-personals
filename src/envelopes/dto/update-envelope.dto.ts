import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvelopeDto } from './create-envelope.dto';
import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserEntity } from '@/users/entities/user.entity';

export class UpdateEnvelopeDto extends PartialType(CreateEnvelopeDto) {
    
    @IsUUID()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDecimal()
    @IsOptional()
    envelope_amount?: number

    @IsUUID()
    user_id: UserEntity;
}
