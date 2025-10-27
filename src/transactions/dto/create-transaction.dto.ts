import { IsCurrency, IsDecimal, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { EnvelopeEnity } from "@/envelopes/entities/envelope.entity";
import { TransactionType } from "../entities/transaction.entity";

export class CreateTransactionDto 
{
    @IsDecimal({ decimal_digits: '0,2', force_decimal: true })
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(['income', 'expense', 'transfer'])
    type: TransactionType;

    @IsString()
    @IsUUID()
    category_id: CategoryEntity;

    @IsUUID()
    @IsOptional()
    envelope_origin?: string;

    @IsUUID()
    @IsOptional()
    envelope_destination?: string;
}
