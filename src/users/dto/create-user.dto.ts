import { Role } from "@/roles/enum/role.enum";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto 
{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsEnum(Role, { message: 'Rol inválido' })
    role: Role;
}
