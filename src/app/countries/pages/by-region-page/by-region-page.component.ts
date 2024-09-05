import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'countries-by-region-page',
  templateUrl: './by-region-page.component.html',
  styleUrl: './by-region-page.component.css'
})
export class ByRegionPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  // Vamos a sacar el searchBox. Refactorizamos porque siempre los continentes van a ser lo mismo, por ende es info estatica
  public regions: Region[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
  // Poenmos ? porque en algun punto de la app, este valor es opcional, como cunado inicia la app, que no hay pais que mostrar
  public selectedRegion?: Region;

  constructor( private countriesService: CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byRegion.countries;
    this.selectedRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchByRegion( region: Region ): void {
    // Una vez yo lanzo searchByCapital, cambio a true
    this.isLoading = true;

    // Cuando hago click en un boton, se dispara la fn y nos da una region, entonces esa region se la damos al selectedRegion
    this.selectedRegion = region;

    this.countriesService.searchRegion( region )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando ya se termino de hacer la peticion y tengo un resultado
        this.isLoading = false;
      } )
    // console.log({term});
  }
}
