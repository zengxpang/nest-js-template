import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// ApiExtraModels(FormatResponseEntity, model)会触发循环依赖，所以这里定义一个
class FormatResponseEntity<T = unknown> {
  /**
   * 状态码
   */
  code?: HttpStatus = 200;

  /**
   * 返回数据
   */
  data?: T;

  /**
   * 返回信息
   */
  msg?: string = 'success';
}

export const ApiFormatResponse = <TModel extends Type<any>>(
  model?: TModel,
  type: 'string' | 'array' | 'object' = 'object',
) => {
  if (!model) {
    return ApiOkResponse({
      schema: {
        title: `formatResponseOfNull`,
        allOf: [
          { $ref: getSchemaPath(FormatResponseEntity<null>) },
          {
            properties: {
              // 显实指定属性，不然生成不了，原因未知
              code: {
                type: 'integer',
                description: '状态码',
                example: HttpStatus.OK,
              },
              msg: {
                type: 'string',
                description: '返回信息',
                example: 'success',
              },
              data: {
                type,
              },
            },
          },
        ],
      },
    });
  }

  return applyDecorators(
    ApiExtraModels(FormatResponseEntity, model),
    ApiOkResponse({
      schema: {
        title: `formatResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(FormatResponseEntity) },
          {
            properties: {
              code: {
                type: 'integer',
                description: '状态码',
                example: HttpStatus.OK,
              },
              msg: {
                type: 'string',
                description: '返回信息',
                example: 'success',
              },
              data: {
                type,
                $ref: type === 'object' ? getSchemaPath(model) : undefined,
                items:
                  type === 'array' ? { $ref: getSchemaPath(model) } : undefined,
              },
            },
          },
        ],
      },
    }),
  );
};
