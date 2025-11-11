import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { IUserResponse } from './types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const savedUser = await this.userRepository.save(newUser);
    return this.generateUserResponse(savedUser);
  }

  async loginUser(loginUserDto: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException('Email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    // check if password is correct
    const isPasswordCorrect = await compare(loginUserDto.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    delete user.password;

    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
  
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  
    return user;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  generateUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
