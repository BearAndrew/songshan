import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const loadingService = inject(LoadingService);

  // 判斷是否為 API 請求
  const isApiRequest = !/^https?:\/\//i.test(req.url);

  const apiUrl = isApiRequest
    ? `${environment.apiBaseUrl}/${req.url.replace(/^\/+/, '')}`
    : req.url;

  const apiReq = req.clone({ url: apiUrl });

  if (isApiRequest) {
    // 記錄發出的 API
    loadingService.show(req.url); // 可以帶原始 URL 或簡化 API 名稱
  }

  return next(apiReq).pipe(
    finalize(() => {
      if (isApiRequest) {
        // 記錄完成的 API
        loadingService.hide(req.url);
      }
    })
  );
};
