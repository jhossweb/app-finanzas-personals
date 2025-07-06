import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto 
{
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isDefault: boolean;

    @IsOptional()
    @IsUUID()
    parentId?: string;

    @IsOptional()
    @IsUUID()
    user?: string;
}
