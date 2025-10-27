import { UserEntity } from "@/users/entities/user.entity";
import { IsBoolean, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEnvelopeDto {


    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDecimal()
    @IsOptional()
    envelope_amount: number

    @IsBoolean()
    @IsOptional()
    is_main?: boolean;


    @IsUUID()
    @IsNotEmpty()
    user_id: UserEntity
}

