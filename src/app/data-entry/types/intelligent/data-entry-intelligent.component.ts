/**
 * This component works to make finding patient gene alterations far easier, inspired by the search at
 * https://ckb.jax.org/geneVariant/find.  Unfortunately, based on the way that external databases are structured,
 * this service only works for previously defined data.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injectable, OnInit, Output, ViewChild } from '@angular/core';

import { Variant } from '../../../global/genomic-data';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IntelligentGenomicsSearchService } from './intelligent-genomics-search.service';

@Component({
  selector: 'data-entry-intelligent',
  template: `
    <div id="root">
      <input #MainSearch type="text" class="form-control" placeholder="Type Here" (focus)="suggestionsOpen = true" (keyup)="search(MainSearch.value)">
      <div id="popupSuggestionPanel" [hidden]="suggestionsOpen === false" [style.width.px]="desiredPopupWidth">
        <table class="table table-hover">
          <tr *ngFor="let option of resultOptions | async">
            <td (click)="onSelection(option)">{{option.toIntelligentDisplayRepresentation()}}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    #root {
      margin-top: 5px;
    }
    
    input {
      height: 60px;
      font-size: 40px;
    }

    #popupSuggestionPanel {
      position: absolute;

      height: 200px;
      background-color: white;
      border: 1px solid black;
      border-top: 0;
      overflow: scroll;
    }
  `]
})

@Injectable()
export class DataEntryIntelligentComponent implements OnInit, AfterViewInit {

  constructor (public intelligentSearchService: IntelligentGenomicsSearchService, myElement: ElementRef) {
    this.elementRef = myElement;
  }

  suggestionsOpen: boolean = false;
  elementRef: ElementRef;
  desiredPopupWidth: number = 0;

  @ViewChild('MainSearch') mainSearch: any;

  @Output() selectNewVariant: EventEmitter<Variant> = new EventEmitter();

  /**
   * These components make searching easier through RxJS Observables.
   */
  searchTerms = new Subject<string>();
  resultOptions: Observable<Variant[]>;
  // Define the options as based on the search terms.
  ngOnInit(): void {
    this.resultOptions = this.searchTerms
      .debounceTime(100)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes (ternary operator)
        ? this.intelligentSearchService.search(term) // return the http search observable
        : Observable.of<Variant[]>([])) // or the observable of empty options if there was no search term
      .catch(error => {
        // TODO: add real error handling
        console.log('Search Service Error', error);
        return Observable.of<Variant[]>([]);
      });
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // Provide the component with a callback for when an option is selected.
  onSelection(variant: Variant): void {
    this.selectNewVariant.emit(variant);
    this.suggestionsOpen = false;
    this.mainSearch.nativeElement.value = variant.toIntelligentDisplayRepresentation();

    console.log('Emitting', variant);
  }

  /**
   * Automatically close menu upon clicking outside of the item.
   */

  // For when the user clicks outside of the dropdown.
  @HostListener('document:click', ['$event'])
  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (inside) {
    } else {
      this.suggestionsOpen = false;
    }
  }

  /**
   * Automatically resize suggestion panel based on text box size.
   */

  ngAfterViewInit() {
    setTimeout(() => this.recalculatePopupWidth(), 20);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.mainSearch.nativeElement.offsetWidth - 2;
    console.log('Set to ' + this.desiredPopupWidth);
  }
}
