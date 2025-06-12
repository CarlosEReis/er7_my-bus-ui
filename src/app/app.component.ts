import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { LinhaX, Ponto, Rota, Veiculo } from './models';
import { interval } from 'rxjs';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { environment } from 'src/environments/environment';

interface Linha {
  id: string;
  numero: string;
  nome: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
