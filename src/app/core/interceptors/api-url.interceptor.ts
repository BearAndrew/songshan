import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // 如果已經是完整 URL（http/https 開頭），就不處理
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  // 把相對路徑補上 apiBaseUrl
  const apiUrl = `${environment.apiBaseUrl}/${req.url.replace(/^\/+/, '')}`;

  const apiReq = req.clone({
    url: apiUrl
  });

  return next(apiReq);
};
