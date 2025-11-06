import { IsArray, IsNotEmpty, IsString } from "class-validator";



export class CreateArticleDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    body: string;

    @IsArray()
    @IsString({ each: true }) // each: true means that each element of the array must be a string
    tagList: string[];
}