/**
 * Since the amount of data that one would have to parse through in a dropdown list while dealing
 * with genomic data is far too vast to be encompassed in a single select field, the filterable search
 * box is a vastly preferable alternative.  What"s nice about Angular is that - using Observables -
 * the options access can be delayed in asynchronous fashion.
 */

import { AfterViewInit, forwardRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";

// Observable class extensions
import "rxjs/add/observable/of";

// Observable operators
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";


import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilterableSearchComponent),
  multi: true
};

/**
 * Ensure that all options have an accessible name.
 */
export interface IFilterableSearchOption {
  optionName: () => string;
}

/**
 * A standard for all filterable search services: a single method which returns either a http request, or
 * an observable of options.
 */
export interface IFilterableSearchService {
  search: (term: string) => Observable <IFilterableSearchOption[]>;
}

@Component({
  selector: "filterable-search",
  template: `
    <div #PopupToggle class="filterToggle" (click)="toggleMenu(true)" [style.border-bottom]="menuCurrentlyOpen ? '0' : '1px solid #dadada'">
      <img src="/assets/entry-and-visualization/dropdown.svg"/>
      
      <!-- Display selected option before click -->
      <p *ngIf="currentlySelected !== undefined && currentlySelected !== null" [hidden]="menuCurrentlyOpen" style="font-style: normal; font-weight: bold;">{{currentlySelected.optionName()}}</p>
      <p *ngIf="currentlySelected === undefined || currentlySelected === null" [hidden]="menuCurrentlyOpen" style="font-style: italic; font-weight: normal;">{{placeholderString}}</p>
      
      <!-- Switch from p to input on click -->
      <input autocomplete="off" #SearchBox [hidden]="!menuCurrentlyOpen" (keyup)="search(SearchBox.value)" placeholder="Search" class="filterInput form-control"/>
    </div>

    <!-- Suggestions for potential selections -->
    <div #PopupPanel class="filterPanel" [hidden]="!menuCurrentlyOpen" [style.width.px]="desiredPopupWidth" [style.height.px]="(options | async)?.length < 6 ? (options | async)?.length * 48 : 288">
      <table class="table table-hover">
        <tr *ngFor="let option of options | async">
          <td (click)="onSelection(option)">{{option.optionName()}}</td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .filterToggle {
      width: 100%;
      height: 38px;

      margin: 0;

      font-size: 18px;
      cursor: pointer;

      border: 1px solid #dadada;
      background-color: white;
      overflow: hidden;
    }

    .filterToggle:hover {
      background-color: #efefef;
    }

    .filterToggle p {
      float: left;
      width: calc(100% - 43px);
      margin: 5px 5px 5px 10px;
    }

    .filterToggle img {
      float: right;
      width: 20px;
      height: 20px;
      margin-top: 9px;
      margin-right: 5px;
    }

    .filterToggle input {
      width: calc(100% - 28px);
      height: 36px;
      margin: 0;
    }

    .filterPanel {
      display: block;
      position: absolute;
      z-index: 1000;

      background-color: white;

      border: 1px solid #dadada;
      border-top: 0;
      
      height: 95px;

      overflow: scroll;
    }

    .filterInput {
      width: 100%;
    }
  `],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class FilterableSearchComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }
  elementRef: ElementRef;

  @Input() placeholderString: string;
  @Input() searchService: IFilterableSearchService; // Provide the component with the appropriate search service on instantiation.

  @ViewChild("SearchBox") searchBox: any;
  @ViewChild("PopupToggle") popupToggle: any;

  desiredPopupWidth: number; // Set in code and updated to DOM via Angular
  menuCurrentlyOpen = false; // Used to toggle between display and filter mode.
  searchTerms = new Subject<string>();
  options: Observable<IFilterableSearchOption[]>;

  // The internal data model (for ngModel)
  _currentlySelected: IFilterableSearchOption = null;
  get currentlySelected(): IFilterableSearchOption {
    return this._currentlySelected;
  }
  set currentlySelected(v: IFilterableSearchOption) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: IFilterableSearchOption) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;
    }
  }

  // Placeholders for the callbacks which are later providesd by the Control Value Accessor
  private onTouchedCallback: () => void = () => {};
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  private onChangeCallback: (_: any) => void = () => {};
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }


  // For when the user clicks outside of the dropdown.
  @HostListener("document:click", ["$event"])
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
  toggleMenu (newState?: boolean): void {
    if (newState && typeof newState === "boolean") {
      if (this.menuCurrentlyOpen === newState) {
        return;
      }
      this.menuCurrentlyOpen = newState;
    } else {
      this.menuCurrentlyOpen = !this.menuCurrentlyOpen;
    }

    if (!this.menuCurrentlyOpen) {
      return;
    }

    this.recalculatePopupWidth();

    // Doesn"t work without timeout...
    setTimeout(() => this.searchBox.nativeElement.focus(), 50);
  }

  ngAfterViewInit() {
    // Otherwise "Expression changed after checked error"
    setTimeout(() => this.recalculatePopupWidth(), 50);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.popupToggle.nativeElement.offsetWidth;
  }


  /**
   * Setting search services and the rest of the required components for this filterable search is important
   * to its functionality.
   */
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
        : Observable.of<IFilterableSearchOption[]>([])) // or the observable of empty options if there was no search term
      .catch(error => {
        // TODO: add real error handling
        console.log("Search Service Error", error);
        return Observable.of<IFilterableSearchOption[]>([]);
      });
  }

  // Provide the component with a callback for when an option is selected.
  onSelection(option: IFilterableSearchOption): void {
    this.currentlySelected = option;
    this.menuCurrentlyOpen = false;
    console.log("Got chosen", option);
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearField = () => {
    this.currentlySelected = null;
  }
}

