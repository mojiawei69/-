import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RootModule } from './Modules/admin/root/root.module';
import { CommonModule } from './Modules/admin/common/common.module';
import { StuCollegeModule } from './Modules/admin/college/college.module';
import { MenuModule } from './Modules/admin/menu/menu.module';
import { RoleModule } from './Modules/admin/role/role.module';
import { ClassModule } from './Modules/admin/class/class.module';
import { StuModule } from './Modules/admin/stu/stu.module';
import { TeacherModule } from './Modules/admin/teacher/teacher.module';
import { CourseModule } from './Modules/admin/course/course.module';
import { WXModule } from './Modules/wx/wx.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "123456",
      "database": "mm_stu",
      "entities": ["./src/**/*.entity{.ts,.js}"],
      "synchronize": true
    }),
    RootModule,
    CommonModule,
    StuCollegeModule,
    MenuModule,
    RoleModule,
    ClassModule,
    StuModule,
    TeacherModule,
    CourseModule,
    WXModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}
