import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';

@Controller('/api/users')
export class UserController {

  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService
  ) { }


  @Get('/create')
  async create(@Query('first_name') firstName: string, @Query('last_name') lastName: string): Promise<User> {
    if (!firstName) {
      throw new HttpException({
        code: 400,
        errors: "First name is required"
      }, 400)
    }
    return this.userRepository.save(firstName, lastName)
  }

  @Get('/hello')
  @UseFilters(ValidationFilter)
  async sayHello(
    @Query('name') name: string,
  ): Promise<string> {
    return this.service.sayHello(name)
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.mailService.send()
    this.emailService.send()

    console.info(this.memberService.getConnectionName())
    this.memberService.sendEmail()


    return this.connection.getName();
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return {
      data: 'Hello JSON',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/:id')
  getById(@Param('id') id: string): string {
    return `Params ID yang dikirimkan : ${id}`;
  }

  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get(): string {
    return 'GET';
  }
}
