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
    <div id="root" [style.height.px]="menuCurrentlyOpen ? 180 : 40">
      <!-- Switches once an option picked -->
      <div #PopupToggle class="filterToggle" (click)="toggleMenu()">
        <p *ngIf="currentlySelected !== null" style="font-style: normal; font-weight: bold;">{{currentlySelected.optionName()}}</p>
        <p *ngIf="currentlySelected === null" style="font-style: italic; font-weight: normal;">{{placeholderString}}</p>
        <img src="/assets/dropdown.png"/>
      </div>

      <!-- Suggestions for potential selections -->
      <div #PopupPanel class="filterPanel" [hidden]="!menuCurrentlyOpen" [style.width.px]="desiredPopupWidth">
        <input autocomplete="off" #SearchBox id="search-box" (keyup)="search(SearchBox.value)" placeholder="Search" class="filterInput form-control"/>
        <div class="suggestions">
          <table class="table table-hover">
            <tr *ngFor="let option of options | async">
              <td (click)="onSelection(option)">{{option.optionName()}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #root {
      z-index: 1000;
      width: calc(100% - 2px);
      border-radius: 5px;
      background-color: white;
      border: 1px solid #c9c9c9;
    }

    .filterToggle {
      margin: 0;
      padding: 5px;
      width: 100%;
      height: 38px;
      font-size: 20px;
      border: 0;
      cursor: pointer;
    }

    .filterToggle:hover {
      background-color: #efefef;
    }

    .filterToggle p {
      float: left;
      width: calc(80% - 28px);
      margin-left: 10px;
    }

    .filterToggle img {
      float: right;
      width: 20px;
      height: 20px;
      margin: 4px;
    }

    .filterPanel {
      position: absolute;

      padding: 5px;
      height: 138px;
      background-color: white;
    }

    .filterInput {
      width: 100%;
    }

    .suggestions {
      height: 95px;
      width: 100%;
      overflow: scroll;
    }
  `],
})
export class FilterableSearchComponent implements OnInit, AfterViewInit {
  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }

  menuCurrentlyOpen = false; // Used to toggle between display and filter mode.
  @Input() placeholderString: string;

  /**
   * Automatically close menu upon clicking outside of the item.
   */
  elementRef: ElementRef;

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

    if (!this.menuCurrentlyOpen) {
      return;
    }

    this.recalculatePopupWidth();
    // Doesn't work without timeout...
    setTimeout(() => this.searchBox.nativeElement.focus(), 50);
  }


  desiredPopupWidth: number; // Set via Angular
  ngAfterViewInit() {
    // Otherwise 'Expression changed after checked error'
    setTimeout(() => this.recalculatePopupWidth(), 50);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  @ViewChild('PopupToggle') popupToggle: any;
  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.popupToggle.nativeElement.offsetWidth;
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
    this.searchTerms.next(option.optionName());
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearField = () => {
    this.currentlySelected = null;
  }
}

