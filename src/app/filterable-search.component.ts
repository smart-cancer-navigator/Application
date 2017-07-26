/**
 * Since the amount of data that one would have to parse through in a dropdown list while dealing
 * with genomic data is far too vast to be encompassed in a single select field, the filterable search
 * box is a vastly preferable alternative.  What's nice about Angular is that - using Observables -
 * the options access can be delayed in asynchronous fashion.
 */

/**
 * Since the SMART app is unable to figure out which cancer type an oncologist is looking at without
 * any sort of user input (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output,
  ViewChild
} from '@angular/core';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

// Extension classes must be Injectable.
export interface FilterableSearchService {
  // TODO: Figure out how to convert jQuery Deferred object to an Observable
  // Must either return an async Observable (i.e. GET requests must be sent), or simply an array of applicable options.
  search: (term: string) => Observable <FilterableSearchOption[]>;
}

export interface FilterableSearchOption {
  optionName: string;
}

@Component({
  selector: 'filterable-search',
  template: `    
    <!-- If form control name is provided vs. not -->
    <button #PopupToggle id="optionSelected" *ngIf="currentlySelected !== null" #selection (click)="currentlyBeingFiltered = !currentlyBeingFiltered" class="filterToggle">{{currentlySelected.optionName}}</button>
    <button #PopupToggle id="nothingSelected" *ngIf="currentlySelected === null" (click)="currentlyBeingFiltered = !currentlyBeingFiltered" class="filterToggle">{{placeholderString}}</button>
    
    <div #PopupPanel class="filterPanel" *ngIf="currentlyBeingFiltered" [style.width.px]="desiredPopupWidth">
      <input #searchBox id="search-box" (keyup)="search(searchBox.value)" placeholder="Search" class="filterInput"/>
      <div class="suggestions">
        <button *ngFor="let option of options | async" (click)="onSelection(option);" class="selectableOption">{{option.optionName}}</button>
      </div>
    </div>
  `,
  styles: [`
    #nothingSelected {
      font-style: italic;
    }

    #optionSelected {
      font-weight: bold;
    }

    #nothingSelected:hover, #optionSelected:hover {
      background-color: #3679af;
      color: white;
    }

    input, button {
      outline: none;
    }

    .filterToggle {
      margin: 0;
      padding: 0;
      width: calc(100% - 2px);
      height: 30px;
      font-size: 20px;
      text-align: center;
      background-color: white;
      border: 1px solid black;
      border-radius: 5px;
    }
    
    .filterPanel {
      display: block;
      position: absolute;
      height: 130px;
      border: 1px solid black;
      border-radius: 5px;
      padding: 5px;
      width: 300px;
      background-color: white;
    }

    .filterInput {
      margin: 0;
      padding: 0;
      width: calc(100% - 4px);
      height: 30px;
      font-size: 20px;
      text-align: center;
    }
    
    .suggestions {
      height: 100px;
      overflow: scroll;
    }

    .selectableOption {
      display: block;
      float: left;
      border-left: 0.5px solid #a8a8a8;
      border-right: 0.5px solid #a8a8a8;
      border-bottom: 0.5px solid #a8a8a8;
      border-top: 0;
      margin: 0;
      padding: 5px;
      width: 100%;
      height: 30px;
      font-size: 18px;
      background-color: white;
      text-align: center;
    }

    .selectableOption:hover {
      color: #eee;
      background-color: #3b8b18;
    }

    p {
      margin: 0;
    }
  `],
})
export class FilterableSearchComponent implements OnInit, AfterViewInit {

  @ViewChild('PopupToggle') popupToggle: any;

  // Since the panel is absolutely positioned, it would be sized oddly if not for this code.
  @ViewChild('PopupPanel') popupPanel: any;
  desiredPopupWidth: number;

  ngAfterViewInit() {
    this.recalculatePopupWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.popupToggle.nativeElement.offsetWidth - 12;
    console.log('Set to ' + (this.popupToggle.nativeElement.offsetWidth - 12));
  }

  public elementRef;

  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }

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
      console.log('inside');
    } else {
      console.log('outside');
      this.currentlyBeingFiltered = false;
    }
  }

  // Used to toggle between display and filter mode.
  currentlyBeingFiltered = false;

  // Provide the component with the appropriate search service on instantiation.
  @Input() searchService: FilterableSearchService;

  // Other available inputs.
  @Input() placeholderString: string;

  // Provide the component with a callback for when an option is selected.
  currentlySelected: FilterableSearchOption = null;
  @Output() onSelected: EventEmitter<FilterableSearchOption> = new EventEmitter();
  onSelection(option: FilterableSearchOption): void {
    this.currentlySelected = option;
    this.currentlyBeingFiltered = false;
    this.onSelected.emit(option);
    this.searchTerms.next(option.optionName);
  }

  // Angular components which apparently make filterable searches easier
  options: Observable<FilterableSearchOption[]>;
  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearField = () => {
    this.currentlySelected = null;
  }

  ngOnInit(): void {
    /**
     * Refer to https://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html.
     * This is essentially subscribing the options to the searchTerms.
     */
    this.options = this.searchTerms
      .debounceTime(100)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes (ternary operator)
        ? this.searchService.search(term) // return the http search observable
        : Observable.of<FilterableSearchOption[]>([])) // or the observable of empty options if there was no search term
      .catch(error => {
        // TODO: add real error handling
        console.log('Search Service Error', error);
        return Observable.of<FilterableSearchOption[]>([]);
      });
  }
}

