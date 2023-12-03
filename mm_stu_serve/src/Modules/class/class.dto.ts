export class ClassCreateDTO {
  name: string;
  remark: string;
  college_id: number;
}

export class ClassUpdateDTO {
  id: number;
  data: ClassCreateDTO;
}

export class ClassQueryDTO {
  college_id: number;
  name: string;
}