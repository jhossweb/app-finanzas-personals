import { Role } from "@/roles/enum/role.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAuthDto 
{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEnum(Role, { message: 'Rol inválido' })
    role: Role;
}


export class LoginAuthDto 
{
    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    username?: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
