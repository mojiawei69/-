import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ClassDAO } from "./class.dao";
import { ClassCreateDTO, ClassQueryDTO, ClassUpdateDTO, UpdateClassTableDTO } from "./class.dto";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { StuClass } from "src/Entity/stu_class.entity";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";

@Injectable()
export class ClassService {

  constructor(private readonly DataSource: DataSource){}

  public ClassDAO = new ClassDAO(this.DataSource);
  
  public async ClassListsPagination(ClassQuery: PaginationQuery<ClassQueryDTO>): ServiceData<ListMetaData<StuClass[]>> {
    try {
      const Classes = await this.ClassDAO.ClassListsPagination(ClassQuery);
      const res: ListMetaData<StuClass[]> = {
        list: Classes,
        meta: {
          total: await this.ClassDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ClassCreate(ClassCreate: ClassCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.ClassDAO.CreateClass(ClassCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ClassUpdate(ClassUpdate: ClassUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.ClassDAO.UpdateClassById(ClassUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ClassDelete(id: number): ServiceData<DeleteResult>{
    try {
      const DeleteResult = await this.ClassDAO.DeleteClassById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ClassAll() : ServiceData<StuClass[]> {
    try {
      const classes = await this.ClassDAO.ClassAll();
      return [ null, classes ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ClassTable(class_id: number) : ServiceData<ClassCourseTeacher[]> {
    try {
      const classTables = await this.ClassDAO.ClassTable(class_id);
      return [ null, classTables]
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async UpdateClassTable(class_table_id: number, Body: UpdateClassTableDTO) : ServiceData<boolean> {
    try {
      await this.ClassDAO.UpdateClassTable(class_table_id, Body);
      return [ null, true ]
    } catch (error) {
      return [new Error(error), false ];
    }
  }
}