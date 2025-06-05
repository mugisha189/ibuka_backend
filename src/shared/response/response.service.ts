import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ResponseDto } from 'src/common/dtos';
import { EResponse } from 'src/common/enums/response-type.enum';

type MakeResParams<T> = {
  message: string;
  payload: T | null;
  responseType?: EResponse;
};

@Injectable({ scope: Scope.REQUEST })
export class ResponseService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public makeResponse<T>(params: MakeResParams<T>): ResponseDto<T> {
    const req = this.request;
    const route = req && (req as any).route ? (req as any).route : undefined;
    const method = req && req.method ? req.method : undefined;
    const { message, payload, responseType = EResponse.SUCCESS } = params;
    const timestamp = new Date().getTime();

    const response: ResponseDto<T> = {
      success: responseType == EResponse.SUCCESS ? true : false,
      path: route && route.path ? route.path : '/',
      message,
      payload,
      method: method || 'N/A',
      timestamp,
    };
    return response;
  }
}
