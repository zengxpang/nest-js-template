import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCatDto {
  /**
   * 名字
   */
  @IsNotEmpty({
    message: '名字不能为空',
  })
  @IsString({
    message: '名字必须是字符串',
  })
  name: string;

  /**
   * 年龄
   */
  @IsNotEmpty({
    message: '年龄不能为空',
  })
  @IsPositive({
    message: '年龄必须为正整数',
  })
  age: number;

  /**
   * 性别
   */
  sex?: string;
}
