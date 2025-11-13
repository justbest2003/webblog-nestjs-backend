import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';

import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    // โหลด ConfigModule และ config.ts
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    // TypeORM จาก env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Production = false
      }),
    }),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
