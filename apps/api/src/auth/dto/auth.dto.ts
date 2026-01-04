import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RequestSmsCodeDto {
    @ApiProperty({
        description: 'Номер телефона в формате +7XXXXXXXXXX',
        example: '+77001234567'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{10,15}$/, { message: 'Некорректный формат номера телефона' })
    phone: string;
}

export class VerifySmsCodeDto {
    @ApiProperty({ example: '+77001234567' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ description: '4-значный код из SMS', example: '1234' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    code: string;

    @ApiProperty({ description: 'Уникальный ID устройства', example: 'device-uuid-123' })
    @IsString()
    @IsNotEmpty()
    deviceId: string;
}

export class LoginEmailDto {
    @ApiProperty({ example: 'admin@logcomp.kz' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'Уникальный ID устройства', example: 'browser-uuid-123' })
    @IsString()
    @IsNotEmpty()
    deviceId: string;
}
