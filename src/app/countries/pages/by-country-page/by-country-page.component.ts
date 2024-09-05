import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styleUrl: './by-country-page.component.css'
})
export class ByCountryPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  constructor( private countriesService: CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCountries.countries;
    this.initialValue = this.countriesService.cacheStore.byCountries.term;
  }

  searchByCountry( term: string ): void {
    // Una vez yo lanzo searchByCapital, cambio a true
    this.isLoading = true;

    this.countriesService.searchCountry( term )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando ya se termino de hacer la peticion y tengo un resultado
        this.isLoading = false;
      } )
    // console.log({term});
  }
}
