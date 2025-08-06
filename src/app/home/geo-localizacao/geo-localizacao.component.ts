import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-geo-localizacao',
  templateUrl: './geo-localizacao.component.html',
  styleUrl: './geo-localizacao.component.css',
})
export class GeoLocalizacaoComponent {

  @Output() localizacaoObtida = new EventEmitter<GeolocationPosition>();

  private modalVisivel = true;

  get visible(): boolean {
    return this.modalVisivel;
  }

  public exibir(): void {
    this.modalVisivel = true;
  }

  public fechar(): void {
    this.modalVisivel = false;
  }

  public obterLocalizacao(): void {
    this.fechar();

    if(!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => this.localizacaoObtida.emit(posicao),
      (erro) => {
        alert('Erro ao obter localização.');
        console.error('Erro de localização:', erro);
      }
    );
  }
}
