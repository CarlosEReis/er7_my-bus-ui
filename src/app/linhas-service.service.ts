import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinhaX } from './models';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinhasServiceService {

  private readonly URL_API = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public buscarLinha(linha: string) : Observable<LinhaX>{
    return this.http.get<LinhaX>(`${this.URL_API}/linhas/${linha}`)
    .pipe(map(response => response))
  }

  public buscarLinhas(search: string) : Observable<any>{
    return this.http
      .get(this.URL_API.concat(`/linhas?search=${search}`))
      .pipe(map((response) => response));
  }
}
