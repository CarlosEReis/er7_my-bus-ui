import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

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
export class AppComponent implements OnInit {

  search: string = '';
  opcoesLinhas: Linha[] = [];

  pesquisar(valor: any){
    this.search += valor.data;
    console.log(this.search);
    this.buscarLinha()
  }


  private buscarLinha() {
    if (this.search.length >= 2) {      
      this.httpClient.get(`http://localhost:8080/linhas/${this.search}`)
      .subscribe((linhas: any) => {
        this.opcoesLinhas = linhas;
        console.log('>>>');
        
        console.log(this.opcoesLinhas);
      })
    }
  }




  title = 'google-maps';

  private map!: google.maps.Map
	private location = {lat: -23.5504467,lng: -46.6340532};
	private zoom = 18; 
  private polyline!: google.maps.Polyline

  private markerOnibus!: google.maps.Marker;
  private markerusuario!: google.maps.Marker;

  private onibus: any = [];


  constructor(
    
    private httpClient: HttpClient) {
    
  }

  

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyBZlvq-ZwMNarpWOEAwvdBZlxU_JPEYoeg',
      libraries: ['geometry', 'marker']
      
    })    
    
    loader.load().then(() => {
      
      const mapElement = document.getElementById("map");
       if (mapElement) {
        
        const trafficLayer = new google.maps.TrafficLayer();

        this.map = new google.maps.Map(mapElement, {
          center: this.location,
          zoom: this.zoom,
          mapId: '4504f8b37365c3d0',
          disableDefaultUI: true
        });

//        trafficLayer.setMap(this.map);

        this.httpClient.get('http://localhost:8080/shapes/6687')
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

        /*this.polyline = new google.maps.Polyline(({
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          path: this.polyline.getPath()
        }))*/


        this.markerOnibus = new google.maps.Marker
        
        //this.solicitaLocalizacao()

        

      } else {
        console.error("Element with id 'map' not found");
      }


    })

    

  }


}
