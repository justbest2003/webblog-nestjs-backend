import { IsNotEmpty, IsOptional, IsString } from "class-validator";



export class UpdateArticleDto {
    @IsNotEmpty({ message: 'Title can not be empty' })
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    body: string;
}