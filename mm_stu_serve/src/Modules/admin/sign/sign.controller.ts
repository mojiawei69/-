import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { SignService } from "./sign.service";
import { SignCreateDTO, SignUpdateDTO, SignQueryDTO } from "./sign.dto";
import { SignCreateValid, SignUpdateValid } from "./sign.valid";
import { StuSign } from "src/Entity/stu_sign.entity";
@Controller("sign")
export class SignController {
  
  constructor(private readonly SignService: SignService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async SignListsPagination(
    @Query() SignQuery: PaginationQuery<SignQueryDTO>
  ) {
    const [ error, Signs ] = await this.SignService.SignListsPagination(SignQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuSign[]>>(HttpStatus.ACCEPTED, Signs).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(SignCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async SignCreate(
    @Body() body: SignCreateDTO
  ){
    console.log(body);
    const [error, InsertResult ] = await this.SignService.SignCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(SignUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async SignUpdate(
    @Body() body: SignUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.SignService.SignUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async SignDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.SignService.SignDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}