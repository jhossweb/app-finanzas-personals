import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEnvelopeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDecimal()
    @IsNotEmpty()
    envelope_amount: number

    @IsUUID()
    @IsNotEmpty()
    user_id: string
}
