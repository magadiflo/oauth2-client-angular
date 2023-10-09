import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

interface ResponseResourceServer {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private _http = inject(HttpClient);
  private _resourceUrl = environment.RESOURCE_URL;

  user(): Observable<ResponseResourceServer> {
    return this._http.get<ResponseResourceServer>(`${this._resourceUrl}/user`)
  }

  admin(): Observable<ResponseResourceServer> {
    return this._http.get<ResponseResourceServer>(`${this._resourceUrl}/admin`)
  }
}
