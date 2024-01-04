import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { JWT } from "src/utils/crypto";
import { svgCode } from "src/utils/sms";
import { IFileUploadStart, TokenDTO } from "./common.dto";
import { Express } from 'express'
import { ReadFile } from "src/common/common";
import * as path from "path";
import { Rules } from "src/utils/regex";
import * as fs from "node:fs";
import * as dotenv from "dotenv";
import * as worker_threads from "worker_threads";

@Injectable()
export class CommonService {

  private filePath: string = path.join(__dirname, "..", "..", "..", "static", "file");

  private imagePath: string = path.join(__dirname, "..", "..","..", "static", "image");

  private fileCreateWorkPath: string = path.join(__dirname, "./file_slice_create_work_thread.js");

  public async getSmsCode(session: Record<string, any>) : Promise<string> {
    const svg = svgCode({ height: 40 });
    session.sms = svg.text;
    return svg.data;
  }

  public async vSmsCode(code: string, session: Record<string, any>) : Promise<boolean> {
    try {
      const sms = session.sms as string;
      return code.toLowerCase() === sms.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  public vToken(token: string) {
    return JWT.verify(token);
  }

  public rToken(Authorization: string) : [Error, string] {
    const [ error, verify ] = JWT.verify(Authorization);
    if(error) {
      if(error === "TokenExpiredError: jwt expired") {
        const deToken = JWT.decode(Authorization) as TokenDTO;
        //过期了先解包里面的用户数据，如权限id
        const token = JWT.genToken({
          uuid: randomUUID(),
          skey: JWT.secret,
          role: deToken.role
        });
        return [ null, token ];
      } else return [ new Error("用户信息无效") , null ];
    }

    return [ null, Authorization ];
  }

  public async FileUpload(file : Express.Multer.File): Promise<[Error, string]> {
    dotenv.config();
    try {
      const md5 = await ReadFile(file);
      const fileSuff = Rules.suff.rule.exec(file.originalname)[0];
      const fileName = `${md5}.${fileSuff}`;
      const filePath = path.join(this.imagePath, fileName);
      fs.writeFileSync(filePath,file.buffer, { flag: "w+" });
      return [ null, `http://${process.env.SERVER_HOST}:8080/image/` + md5 + "." + fileSuff ];
    } catch (error) {
      return [new Error(error), null]; 
    }
  }

  public async FileUploadStart(md5: string, filename: string) : Promise<[Error, IFileUploadStart]> {
    try {
      const MD5FilePath = path.join(this.filePath, md5);
      /**
       * 获取文件后缀名
       * 判断该md5文件夹下的文件数量，比对判断文件是否上传完整
       */
      const fileSuff = Rules.suff.rule.exec(filename)[0];
      
      try {
        fs.opendirSync(MD5FilePath);
      } catch (error) {
        fs.mkdirSync(MD5FilePath);
      }
      const result: IFileUploadStart = {
        md5: md5,
        chunk: 0
      }
      return [ null, result ];
    } catch (error) {
      return [new Error(error), null]; 
    }
  }

  public async FileUploadSlice(file : Express.Multer.File, number: number, md5: string) : Promise<[Error, string]> {
    try {
      //新建工作线程执行文件创建
        const main_thread = new worker_threads.Worker(this.fileCreateWorkPath, {
          workerData: {
            dirname: md5,
            file: file.buffer,
            number: number
          }
        });
        main_thread.on("message", value => {
          //console.log("创建分片文件完成::",value);
        });
        main_thread.on("error", error => console.error("创建分片文件失败::",error))
      return [ null, "ok" ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}