import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-country-page',
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.css'
})
export class CountryPageComponent implements OnInit {

  // Pongo ? porque puede ser null, en algun punto del flujo de mi app, peude ser null
  public country?: Country;

  // Necesito obtener el URL y poder navegar a la persona
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countriesService: CountriesService
  ) {}

  // ngOnInit(): void {
  //   this.activatedRoute.params
  //     // Aca ya obtengo el ID
  //     .subscribe( ({ id }) => {
  //       // Aca paso el id y par que se dispare la peticion me tengo que subscribir
  //       this.countriesService.searchCountryByAlphaCode(id)
  //         .subscribe(country => {
  //           console.log({country});
  //         })
  //     })
  // }

  // Para resolver el lio de codigo que teniamos arriba, se puede hacer lo siguiente:
  // Como yo se que params es un Observable, puedo utilizar los PIPES
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        // Recibe el valor anterior "en este caso el params", y su objetivo es regresar un nuevo Observable, lo cual nos sacaria la repeticion de otra subscripcion, solamente que no vamos a recibir el id, sino que el resultado del nuevo Observable
        // De params, hago destructuring y saco el id
        switchMap(({id}) => this.countriesService.searchCountryByAlphaCode(id) )
      )
      // Lo que sea que regrese el switchMap lo vamos a utilizar en este subscribe.
      // Si ponemos el mouse sobre resp o country, vamos a ver que regresa Country[], no los params. Y eso es porque el switchMap hace que cambie el subscribe, o sea siempre va a estar subscripto al de abajo, pero ahora esta subscripto al resultado de arriba "this.countriesService.searchCountryByAlphaCode(id) )"
      // Gracias a lo que se hizo en "countries.service" para que la funcion devuelva un Country o null
      .subscribe( country => {
        // Ahora si, si no existe un country, o sea si cae en null, nos vamos a redirigir a la pagina que le digamos al user.
        if (!country) return this.router.navigateByUrl('');
        return this.country = country;
      })
  }
}
