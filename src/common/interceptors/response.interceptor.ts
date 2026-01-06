import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { BaseResponse } from "../response.base";

@Injectable()
export class ResponseInterceptor implements NestInterceptor{
    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => new BaseResponse(200, 'Success', data)),
        )
    }
    
}