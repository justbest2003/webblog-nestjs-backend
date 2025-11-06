import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { User } from '../user/decorators/user.decorator';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const newArticle = await this.articleService.createArticle(
      user,
      createArticleDto,
    );
    return this.articleService.generateArticleResponse(newArticle);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.getSingleArticle(slug);
    return this.articleService.generateArticleResponse(article);
  }

  @Put(':slug')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updatedArticle = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );
    return this.articleService.generateArticleResponse(updatedArticle);
  }

  @Get()
  async getArticles(@Query() query: any): Promise<IArticlesResponse> {
    return this.articleService.findAll(query);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<IArticleResponse> {
    const addedArticle = await this.articleService.addToFavoriteArticle(currentUserId, slug);
    return this.articleService.generateArticleResponse(addedArticle);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeArticleFromFavorites(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<IArticleResponse> {
    const removedArticle = await this.articleService.removeArticleFromFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.generateArticleResponse(removedArticle);
  }

  @Delete(':slug')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ) {
    await this.articleService.deleteArticle(slug, currentUserId);
    return {
      message: 'Article deleted successfully',
    };
  }
}
