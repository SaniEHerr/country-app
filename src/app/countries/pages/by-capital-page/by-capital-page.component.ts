import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styleUrl: './by-capital-page.component.css'
})
export class ByCapitalPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  // Inyectamos el servicio para utilizar la peticion http
  constructor( private countriesService: CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCapital.countries;
    this.initialValue = this.countriesService.cacheStore.byCapital.term;
  }

  // Si no nos subscribimos al Observable, NUNCA se emite por mas que hagamos la referencia el y que tecnicamente la linea regresa el Observable
  // Luego de subscribirnos, sabemos que nos devuelve un Country[], por lo que si queremos mostrar esto en nuestro HTML tenemos que crear una propiedad y luego hacer la logica para que los paises se guarden en ese array
  searchByCapital( term: string ): void {

    // Una vez yo lanzo searchByCapital, cambio a true
    this.isLoading = true;

    this.countriesService.searchCapital( term )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando ya se termino de hacer la peticion y tengo un resultado
        this.isLoading = false;
      } )
    // console.log({term});
  }
}
