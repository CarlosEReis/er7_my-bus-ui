import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { interval } from 'rxjs';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { LinhaX, Ponto, Rota, Veiculo } from 'src/app/models';
import { LinhasServiceService } from 'src/app/linhas-service.service';
import { AuthService } from '@auth0/auth0-angular';

interface Linha {
  id: string;
  numero: string;
  nome: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly API_URL = environment.apiUrl;

  modalGeoLocalizacao = true;
  posicaoUsuario!: google.maps.Marker;

  transitoAtivo = false;
  trafficLayer!: google.maps.TrafficLayer;

  fixaNaPosicao = false;
  modalSearch = false;
  menu: MenuItem[] = [
    {
      icon: 'pi pi-search',
      tooltipOptions: {
        tooltipLabel: 'Pesquisar linha',
      },
      command: () => {
        this.modalSearch = true;
      },
    },
    {
      icon: 'pi pi-sort-alt',
      tooltipOptions: {
        tooltipLabel: 'Inverter Sentido',
      },
      command: () => this.inverterSentido(),
    },
    {
      icon: 'pi pi-map',
      tooltipOptions: {
        tooltipLabel: 'Localização',
      },
      command: () => this.solicitaLocalizacao(),
    },
    {
      icon: 'pi pi-map-marker',
      tooltipOptions: {
        tooltipLabel: 'Fixar posição',
      },
      command: () => this.fixaNaPosicaoUsuario(),
    },
    {
      icon: 'pi pi-car',
      tooltipOptions: {
        tooltipLabel: 'Habilitar Trânsito',
      },
      command: () =>
        this.transitoAtivo
          ? this.desabilitaTransito()
          : this.habilitaTransito(),
    },
    {
      icon: 'pi pi-sign-out',
      tooltipOptions: {
        tooltipLabel: 'Logout',
      },
      command: this.logout.bind(this),
    },
  ];

  logout() {
    this.auth.logout();
  }

  private habilitaTransito() {
    this.transitoAtivo = true;
    this.trafficLayer = new google.maps.TrafficLayer();
    this.trafficLayer.setMap(this.map);
    this.trafficLayer.setOptions({ autoRefresh: true });

    this.polyline.setOptions({
      strokeColor: '#979393',
      strokeOpacity: 0.4,
      strokeWeight: 15,
    });
  }
  private desabilitaTransito() {
    this.transitoAtivo = false;
    this.trafficLayer.setMap(null);
    this.trafficLayer.unbindAll();

    this.polyline.setOptions({
      //strokeColor: rota === 1 ? "#FF0000" : "#2168C9",
      strokeOpacity: 1.0,
      strokeWeight: 2.5,
    });
  }

  private inverterSentido() {
    if (this.direcaoSelecionada === 1) {
      this.direcaoSelecionada = 2;
    } else {
      this.direcaoSelecionada = 1;
    }
    this.aoSelecionarDirecao(this.direcaoSelecionada);
  }

  public solicitaLocalizacao() {
    this.modalGeoLocalizacao = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        //this.zoom    = 15;

        this.map.setZoom(15);
        //this.map.setCenter(this.location);

        this.markerusuario.setValues({
          position: this.location,
          map: this.map,
          animation: google.maps.Animation.BOUNCE,
          icon: 'https://img.icons8.com/3d-fluency/40/map-pin.png',
        });

        //this.posicaoUsuario = new google.maps.Marker({
        //})

        this.map.setCenter({ lat: this.location.lat, lng: this.location.lng });
      });
    } else {
      alert('Ops, não foi possóvel obter a localização.');
    }
  }

  private fixaNaPosicaoUsuario() {
    this.fixaNaPosicao = !this.fixaNaPosicao;
    if (this.fixaNaPosicao) {
      this.map.setCenter({ lat: this.location.lat, lng: this.location.lng });
      this.map.setZoom(15);
    } else {
      this.centralizaNaRota();
    }
  }

  teste() {
    this.modalSearch = true;
  }

  search: string = '';
  linhaSelecionada = '';
  opcoesLinhas: Linha[] = [];

  direcaoSelecionada: any;
  veiculosDirecaoSelecionada: Veiculo[] = [];
  opcoesVeiculosDirecao: any[] = [];
  veiculo!: string;

  opcoesDirecao: any[] = [];
  atualizadorAtivo = false;

  public readonly tempoAtualizacao = 20000;
  public tempoCorrenteAtualizao = 0;
  private intervalID: any;

  linhaX!: LinhaX;
  markersPontos: google.maps.Marker[] = [];
  markersOnibus: google.maps.Marker[] = [];

  pesquisar(valor: any) {
    this.search += valor.data;
  }

  public aoSelecionar(numeroDaLinha: string) {
    clearInterval(this.intervalID);
    this.linhaService.buscarLinha(numeroDaLinha).subscribe((linha: any) => {
      this.linhaX = linha;
      this.listarDirecoes(numeroDaLinha);
    });
  }

  public aoSelecionarVeiculo(placa: any) {
    console.log(this.veiculo);

    this.veiculo
      ? this.centralizaNoVeiculo(this.veiculo)
      : this.centralizaNaRota();
  }

  public removeLinha() {
    console.log('removendo');

    this.search = '';
    this.veiculo = '';
    this.linhaSelecionada = '';
    this.direcaoSelecionada = '';
    this.opcoesLinhas = [];
    this.direcaoSelecionada = '';
    this.opcoesDirecao = [];
    this.opcoesVeiculosDirecao = [];
    clearInterval(this.intervalID);
  }

  public aoSelecionarDirecao(pathId: string) {
    this.modalSearch = false;
    this.tempoCorrenteAtualizao = 0;
    clearInterval(this.intervalID);
    this.opcoesVeiculosDirecao = [];

    this.direcaoSelecionada = pathId;
    this.buscarPath(pathId);
    this.markersOnibus.forEach((marker) => marker.setMap(null));
    this.atualizaVeiculos();
  }

  private listarDirecoes(numeroDaLinha: string) {
    const rotas = this.linhaX.rotas;
    this.opcoesDirecao = rotas.map((rota: Rota) => ({
      name: this.returnaOsBairros(rota.destino),
      value: rota.idTipoSentido,
    }));
  }

  public buscarLinha() {
    if (this.search.length >= 2) {
      this.linhaService.buscarLinhas(this.search).subscribe({
        next: (linhas: any) => {
          this.opcoesLinhas = linhas.map((linha: Linha) => ({
            name: this.returnaOsBairros(linha.nome),
            code: linha.id,
          }));
        },
        error: (erro) => console.log(erro),
      });

      /*.get(this.API_URL.concat(`/linhas?search=${this.search}`))
        .subscribe({
          next: (linhas: any) => {
            this.opcoesLinhas = linhas.map((linha: Linha) => ({
              name: this.returnaOsBairros(linha.nome),
              code: linha.id,
            }));
          },
          error: (erro) => console.log(erro),
        });*/
    }
  }

  private buscarPath(idTipoSentido: any) {
    this.polyline.setMap(null);

    let rota = this.linhaX.rotas.find(
      (rota: Rota) => rota.idTipoSentido === idTipoSentido
    );
    let pathDecode = google.maps.geometry.encoding.decodePath(rota?.encode);
    console.log(JSON.stringify(pathDecode));

    this.setaRotaNoMapa(rota?.idTipoSentido, pathDecode);
    if (!this.fixaNaPosicao) {
      this.centralizaNaRota();
    }
    this.setaParadas(rota);
    this.contadorTempoAtualizacao();
  }

  private setaParadas(rota: Rota | undefined) {
    const pontos: Ponto[] | undefined = rota?.pontos;

    this.markersPontos.forEach((marker) => marker.setMap(null));

    pontos?.forEach((ponto: Ponto) => {
      let marker = new google.maps.Marker({
        position: { lat: ponto.latitude, lng: ponto.longitude },
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 2,
        },
      });
      this.markersPontos.push(marker);
    });
    this.setaVeiculos();
  }

  private setaVeiculos() {
    let direcao = this.direcaoSelecionada === 1 ? 'ida' : 'volta';
    let veiculos = this.linhaX.veiculos.filter(
      (veiculo: Veiculo) => veiculo.sentidoLinha === direcao
    );

    this.veiculosDirecaoSelecionada = veiculos;

    veiculos.forEach((veiculo: Veiculo) => {
      this.opcoesVeiculosDirecao.push({
        name: veiculo.placa,
        value: veiculo.placa,
      });

      let marker = new google.maps.Marker({
        position: { lat: veiculo.latitude, lng: veiculo.longitude },
        map: this.map,
        icon: '',
        label: veiculo.placa,
        title: veiculo.placa,
      });
      this.markersOnibus.push(marker);
    });

    if (!this.atualizadorAtivo) {
      this.atualizadorAtivo = true;
      console.log('Chamando SET INTERVAL');
      setInterval(() => {
        this.atualizaVeiculos();
      }, this.tempoAtualizacao);
    }
  }

  private contadorTempoAtualizacao() {
    this.intervalID = setInterval(() => {
      this.tempoCorrenteAtualizao++;
    }, 1000);
  }

  private atualizaVeiculos() {
    console.log('atualizando veiculos');
    this.tempoCorrenteAtualizao = 0;
    this.markersOnibus.forEach((marker) => marker.setMap(null));

    let linha = this.linhaX.codigo;
    const infoWindow = new google.maps.InfoWindow();
    let direcao = this.direcaoSelecionada === 1 ? 'ida' : 'volta';
    this.linhaService.buscarLinha(linha).subscribe({
      next: (linhas: any) => {
        this.veiculosDirecaoSelecionada = linhas.veiculos.filter(
          (veiculo: Veiculo) => veiculo.sentidoLinha === direcao
        );
        this.veiculosDirecaoSelecionada.map((veiculo: Veiculo) => {
          let marker = new google.maps.Marker({
            position: { lat: veiculo.latitude, lng: veiculo.longitude },
            map: this.map,
            icon: '',
            title: veiculo.placa,
            label: {
              text: '\ue530', // codepoint from https://fonts.google.com/icons
              fontFamily: 'Material Icons',
              color: '#ffffff',
              fontSize: '18px',
            },
          });
          marker.addListener('click', () => {
            infoWindow.close();
            infoWindow.setContent('<b>Placa: </b>' + marker.getTitle());
            infoWindow.open(marker.getMap(), marker);
          });
          let d = new Date(veiculo.dataUltimaTransmissao);
          let moment = new Date();
          console.log(
            `LOG ${moment.toLocaleTimeString()} ----- PLACA: ${
              veiculo.placa
            } - TRAMISSÃO: ${d.toLocaleDateString()} - ${d.toLocaleTimeString()} - TRANS.CICLO: ${
              veiculo.alertaNaoTransmitiuCiclo
            }`
          );

          this.markersOnibus.push(marker);

          if (!this.fixaNaPosicao) {
            if (this.veiculo) {
              console.log(this.veiculo);
              this.centralizaNoVeiculo(this.veiculo);
            } else {
              this.centralizaNaRota();
            }
          }
        });
      },
      error: (erro: any) => alert(JSON.stringify(erro)),
    });
  }

  private centralizaNaRota() {
    let bounds = new google.maps.LatLngBounds();
    this.polyline.getPath().forEach((path) => bounds.extend(path));

    this.map.fitBounds(bounds);
  }

  private centralizaNoVeiculo(placa: string) {
    //let bounds = new google.maps.LatLngBounds();

    this.veiculosDirecaoSelecionada.forEach((veiculo: Veiculo) => {
      if (veiculo.placa === placa) {
        this.map.setCenter({ lat: veiculo.latitude, lng: veiculo.longitude });
        //bounds.extend({ lat: veiculo.latitude, lng: veiculo.longitude})
      }
    });
    this.map.setZoom(17);
    //this.map.fitBounds(bounds);
  }

  private setaRotaNoMapa(rota: number = 0, pathDecode: google.maps.LatLng[]) {
    this.polyline = new google.maps.Polyline({
      geodesic: true,
      strokeColor: rota === 1 ? '#FF0000' : '#2168C9',
      strokeOpacity: 1.0,
      strokeWeight: 2.5,
      path: pathDecode,
    });
    this.polyline.setMap(this.map);
    //this.setPontoInicialEFinal(pathDecode);
  }

  private returnaOsBairros(s: string): string {
    const regex = /\((.*?)\)/g;
    let correspondencia;
    let resultado = [];
    while ((correspondencia = regex.exec(s)) !== null) {
      resultado.push(correspondencia[1]);
    }
    return resultado.join(' - ');
  }

  title = 'google-maps';

  private map!: google.maps.Map;
  private location = { lat: -23.5504467, lng: -46.6340532 };
  private zoom = 18;
  private polyline!: google.maps.Polyline;

  private markerOnibus!: google.maps.Marker;
  private markerusuario!: google.maps.Marker;

  private onibus: any = [];

  constructor(
    private httpClient: HttpClient,
    private linhaService: LinhasServiceService,
    private auth: AuthService
  ) {
    this.linhaService.buscarLinha('122');
  }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyBZlvq-ZwMNarpWOEAwvdBZlxU_JPEYoeg',
      libraries: ['geometry', 'marker'],
    });

    loader.load().then(() => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const trafficLayer = new google.maps.TrafficLayer();

        this.map = new google.maps.Map(mapElement, {
          center: this.location,
          mapId: '4504f8b37365c3d0',
          disableDefaultUI: true,
          zoom: 16,
          heading: 320,
          tilt: 47.5,
        });

        this.polyline = new google.maps.Polyline();
        this.markerusuario = new google.maps.Marker();

        //        trafficLayer.setMap(this.map);

        /*this.httpClient.get('http://192.168.1.5:8080/shapes/6687')
        .subscribe((c: any) => {
          const t  = c.points.map((p: any) => ({ lat: Number.parseFloat(p[1]), lng: Number.parseFloat(p[2]) }))
          console.log(t);

          this.polyline = new google.maps.Polyline(({
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            path: t
          }))
          this.polyline.setMap(this.map);

          let bounds = new google.maps.LatLngBounds();
          this.polyline.getPath().forEach((path) => bounds.extend(path))

          this.map.fitBounds(bounds);
          }
        )
        this.markerOnibus = new google.maps.Marker*/
      } else {
        console.error("Element with id 'map' not found");
      }
    });
  }
}
