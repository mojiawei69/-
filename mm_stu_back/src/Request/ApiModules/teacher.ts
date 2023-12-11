import { AxiosApi } from "../AxiosApis";
import { Gender } from "@/Request/index.type";

export interface TeacherEdit {
  name?: string;
  remark?: string;
  gender: Gender;
  profile: string;
  age: number;
}

export enum Authentication {
  wait = "待认证",
  accept = "已认证"
}

export interface TeacherQuery {
  name?: string;
  authentication?: Authentication
}

export class teacher extends AxiosApi {
  constructor(){
    super("/api/teacher");
  }

}

export default new teacher();