import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { ICommentResponse } from './types/commentResponse.interface';
import { ICommentsResponse } from './types/commentsResponse.interface';
import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('articles')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':slug/comments')
  async getComments(@Param('slug') slug: string): Promise<ICommentsResponse> {
    return await this.commentService.getComments(slug);
  }

  @Post(':slug/comments')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createComment(
    @User() user: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<ICommentResponse> {
    const comment = await this.commentService.createComment(
      user,
      slug,
      createCommentDto,
    );
    return comment;
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('id') commentId: number,
  ): Promise<void> {
    return await this.commentService.deleteComment(
      slug,
      commentId,
      currentUserId,
    );
  }
}
