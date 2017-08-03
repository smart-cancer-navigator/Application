/**
 * Since the amount of data that one would have to parse through in a dropdown list while dealing
 * with genomic data is far too vast to be encompassed in a single select field, the filterable search
 * box is a vastly preferable alternative.  What's nice about Angular is that - using Observables -
 * the options access can be delayed in asynchronous fashion.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

/**
 * Ensure that all options have an accessible name.
 */
export interface FilterableSearchOption {
  optionName: () => string;
}

/**
 * A standard for all filterable search services: a single method which returns either a http request, or
 * an observable of options.
 */
export interface FilterableSearchService {
  search: (term: string) => Observable <FilterableSearchOption[]>;
}

@Component({
  selector: 'filterable-search',
  template: `
    <!-- If form control name is provided vs. not -->
    <div id="fullContainer" [style.height.px]="menuCurrentlyOpen ? 170 : 30">
      <!-- Swaps when an option is selected from the placeholder to the option name.  -->
      <button *ngIf="currentlySelected !== null" #PopupToggle id="optionSelected" class="filterToggle" (click)="toggleMenu()">{{currentlySelected.optionName()}}</button>
      <button *ngIf="currentlySelected === null" #PopupToggle id="nothingSelected" class="filterToggle" (click)="toggleMenu()">{{placeholderString}}</button>

      <!-- The popup suggestion panel -->
      <div #PopupPanel class="filterPanel" [hidden]="!menuCurrentlyOpen" [style.width.px]="desiredPopupWidth">
        <input #SearchBox id="search-box" (keyup)="search(searchBox.value)" placeholder="Search" class="filterInput"/>
        <div class="suggestions">
          <button *ngFor="let option of options | async" (click)="onSelection(option)" class="selectableOption">
            {{option.optionName()}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #fullContainer {
      background-color: white;
      border: 1px solid black;
      border-radius: 5px;
    }

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

    .filterToggle {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 28px;
      font-size: 20px;
      text-align: center;
      border: 0;
      background-color: white;
    }

    .filterPanel {
      display: block;
      position: absolute;

      height: 130px;
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
      border: 1px solid #d6d6d6;
      border-radius: 5px;
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
      padding: 2px;
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

  menuCurrentlyOpen = false; // Used to toggle between display and filter mode.
  @Input() placeholderString: string;

  /**
   * Automatically close menu upon clicking outside of the item.
   */
  elementRef: ElementRef;

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
    } else {
      this.menuCurrentlyOpen = false;
    }
  }


  /**
   * Automatically resize the popup menu upon creating the menu or resizing the window.
   */
  @ViewChild('SearchBox') searchBox: any;
  toggleMenu = () => {
    this.menuCurrentlyOpen = !this.menuCurrentlyOpen;
    this.recalculatePopupWidth();
    setTimeout(() => this.searchBox.nativeElement.focus(), 100);
  }

  desiredPopupWidth: number; // Set via Angular
  ngAfterViewInit() {
    // Otherwise 'Expression changed after checked error'
    setTimeout(() => this.recalculatePopupWidth(), 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  @ViewChild('PopupToggle') popupToggle: any;
  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.popupToggle.nativeElement.offsetWidth - 12;
  }


  /**
   * Setting search services and the rest of the required components for this filterable search is important
   * to its functionality.
   */
  // Available options for given search terms.
  searchTerms = new Subject<string>();
  options: Observable<FilterableSearchOption[]>;
  // Define the options as based on the search terms.
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

  // Provide the component with the appropriate search service on instantiation.
  @Input() searchService: FilterableSearchService;

  // Provide the component with a callback for when an option is selected.
  currentlySelected: FilterableSearchOption = null;
  @Output() onSelected: EventEmitter<FilterableSearchOption> = new EventEmitter();
  onSelection(option: FilterableSearchOption): void {
    this.currentlySelected = option;
    this.menuCurrentlyOpen = false;
    this.onSelected.emit(option);
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearField = () => {
    this.currentlySelected = null;
  }
}

