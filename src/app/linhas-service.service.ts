import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinhaX } from './models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinhasServiceService {

  private readonly URL_API = 'https://er7-my-bus-api.onrender.com';

  constructor(private http: HttpClient) { }

  public buscarLinha(linha: string) : Observable<LinhaX>{
    return this.http.get<LinhaX>(`${this.URL_API}/linhas/${linha}`)
    .pipe(map(response => response))
  }

}
