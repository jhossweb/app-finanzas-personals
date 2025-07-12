import { IsCurrency, IsDecimal, IsEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { UserEntity } from "../../users/entities/user.entity";

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

    @IsString()
    @IsUUID()
    user_id: UserEntity;

    @IsString()
    @IsUUID()
    category_id: CategoryEntity;
}
