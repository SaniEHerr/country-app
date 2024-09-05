import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  }

  constructor(private http: HttpClient) {
    // Cuando se construye, cargo lo que hay en el localStorage
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify(this.cacheStore) )
  }

  private loadFromLocalStorage() {
    if (!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!)
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError( () => of([]) )
        // delay(2000)
      )
  }

  // Aca no podemos pasar el "Observable<Country[]>". Deberiamos pasar un pais si es que existe, pero solo 1, no un array, ya que searchCountryByAlphaCode deberia regresar solo uno, no un array
  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`

    return this.http.get<Country[]>(url)
      .pipe(
        // Transformamos la info. El array de countries (que es lo que nos regresa la api). Luego la logica implicita
        map( countries => countries.length > 0 ? countries[0] : null ),
        // Ahora si, gracias al map, tenemos una fn que nos regresa un pais si es que lo encuentra o null.
        catchError( () => of(null)  )
      )
  }

  searchCapital(term: string): Observable<Country[]> {
    // Hasta el get, regresa un Observable, por lo que yo puede decir que si yo meto el return abajo, regreso el Observable, que viene de 'rxjs'. Este Observable me pide que dato voy a regresar cuando yo busque con la fn searchCapital, y lo que regreso yo es un Country, y mejor dicho seria que regreso un array de Country, porque voy a regresar mas de uno en ciertos casos
    // Tambien tengo que especificar que va a regresar el get para que cumpla especificamente lo que yo estoy diciendo que regrese mas arriba ":Observable<Country[]>". Si nosotros no pondriamos esa linea de recien, TS lo va a inferir por nosotros y este error "El tipo 'Observable<Object>' no se puede asignar al tipo 'Observable<Country[]>' no nos apareceria. Pero eso no nos sirve, ya que nuestra fn nos estaria regresando un Observable que retorna un Object lo cual no nos sirve porque no vamos a saber que metodos y propiedades tiene eso. Por eso siempre es bueno decir que vamos a retornar el inicio ":Observable<Country[]>" para que TS nos ayude a detectar conflictos luego. Por ende ese get va tiparlo y sabemos que retorna <Country[]>
    // Para que se ejecute la peticion hay que realizar el susbscribe (se hace en el componente que va a utilizar la peticion), hay que subscribirse para escuchar el cambio. Si no hay ningun subscribe, la peticion se esta definiendo pero no se ejecuta.
    const url = `${this.apiUrl}/capital/${term}`

    // Dentro de pipe, uso catchError. Si hay un error yo lo recibo en el catchError, y lo que regreso es el nuevo observable. El of sirve para construir rapidamente un observable basado en el argumento que yo le mando dentro del of.
    // return this.http.get<Country[]>(url)
      // .pipe(
        // Si sucede un error, atrapa el error, y regresa un nuevo observable, que va a ser un array vacio
      //   catchError( error => of([])  )
      // )

    // Refactorizacion con mi nuevo metodo
    return this.getCountriesRequest(url)
      // Guardamos la data
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term: term, countries: countries } ),
        // Cada vez que hago una modificacion al objeto, se dispara el save en el localStorage.
        tap( () => this.saveToLocalStorage() )
      )
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`

    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term: term, countries: countries } ),
        tap( () => this.saveToLocalStorage() )
      )
  }

  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`

    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region: region, countries: countries } ),
        tap( () => this.saveToLocalStorage() )
      )
  }
}
