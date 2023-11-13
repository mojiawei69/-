import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuTeacher } from "./stu_teacer.entity";
import { ClassCourseTeacher } from "./teacher_course_class.entity";

@Entity("mm_stu_stu_course")
export class StuCourse extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "课程名称"})
  name: string;

  @ManyToMany(type => StuTeacher, StuTeacher => StuTeacher.courses)
  teachers: StuTeacher[]

  @OneToMany(() => ClassCourseTeacher, (ClassCourseTeacher) => ClassCourseTeacher.course)
  classCourseTeachers: ClassCourseTeacher[];
}