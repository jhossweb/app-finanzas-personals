import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    description?: string;
}


export class UpdateCategoryActive {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}