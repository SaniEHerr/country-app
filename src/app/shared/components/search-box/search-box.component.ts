import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime } from "rxjs"

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  // Debounce para las peticiones.
  // Un Subject es un tipo especial de Observable
  private debouncer: Subject<string> = new Subject<string>();
  // Para limpiar el la subscripcion
  private debouncerSubscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    // Como el "debouncer" es un tipo de Observable, puedo susbscribirme
    // Lo que quiero lograr es mandar a hacer una nueva emision en este observabke cada vez que la persona toca una tecla
    // Se encarga de hacer las emisiones.
    // Si bien hasta ahora no hace que funcione mi Debouncer, como esto es un Observable tenemos todos los operadores de rxjs, siendo "debounceTime" el que nos va a ayudar. Este pide 2 valores, el primero es cuanto tiempo queremos esperar para hacer la siguiente emision y el segundo (sheduler) que nos pregunta cuando nosotros queremos ejecutar esa emision.
    // Entonces el observable emite un valor, llega el pipe, que tiene un debounceTime, que tiene un operador el cual marca que tiene que esperar 1 segundo para ver si no recibe mas valores, si recibe otro valor, va a volver a esperar otro segundo y no emite nada. Hasta que el user deje de emitir valores por 1 segundo, ahi recien va a llamar o mejor dichar mnadar el valor al subscribe.
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(300)
    )
    .subscribe(value => {
      this.onDebounce.emit( value )
    })
  }

  // Cuando se destruye un componente, limpio la subscripcion
  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe;
  }

  emitValue(value: string):void {
    this.onValue.emit( value );
  }

  onKeyPress( searchTerm: string ) {
    // "next" sirve para hacer la siguiente emision del observable
    // Entonces el que se encarga de hacer las emisiones es el Debouncer, el observable de arriba
    this.debouncer.next( searchTerm );
  }

}
