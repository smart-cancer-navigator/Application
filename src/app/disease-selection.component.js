/**
 * Since the SMART app is unable to figure out which disease an oncologist is looking at without
 * any sort of user data (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var router_1 = require("@angular/router");
var smart_reference_service_1 = require("./smart-reference.service");
var Subject_1 = require("rxjs/Subject");
var disease_search_service_1 = require("./disease-search.service");
// Observable class extensions
require("rxjs/add/observable/of");
// Observable operators
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var DiseaseSelectionComponent = (function () {
    function DiseaseSelectionComponent(diseaseSearchService, router) {
        this.diseaseSearchService = diseaseSearchService;
        this.router = router;
        this.searchTerms = new Subject_1.Subject();
    }
    // Push a search term into the observable stream.
    DiseaseSelectionComponent.prototype.search = function (term) {
        this.searchTerms.next(term);
    };
    DiseaseSelectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(smart_reference_service_1.SMARTReferenceService.getSMARTInstance());
        this.diseases = this.searchTerms
            .debounceTime(300) // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged() // ignore if next search term is same as previous
            .switchMap(function (term) { return term // switch to new observable each time the term changes
            ? _this.diseaseSearchService.search(term)
            : Observable_1.Observable.of([]); })
            .catch(function (error) {
            // TODO: add real error handling
            console.log(error);
            return Observable_1.Observable.of([]);
        });
    };
    DiseaseSelectionComponent.prototype.gotoDetail = function (disease) {
        var link = ['/data-entry', disease.name];
        this.router.navigate(link);
    };
    return DiseaseSelectionComponent;
}());
DiseaseSelectionComponent = __decorate([
    core_1.Component({
        selector: 'disease-selection',
        template: "\n    <h1>Select Patient Cancer Type</h1>\n    <input #searchBox id=\"search-box\" (keyup)=\"search(searchBox.value)\" />\n    <div>\n      <div *ngFor=\"let disease of diseases | async\"\n           (click)=\"gotoDetail(disease)\" class=\"search-result\" >\n        {{hero.name}}\n      </div>\n    </div>\n  ",
        styles: ["    \n    h1 {\n      text-align: center;\n    }\n    \n    input {\n      width: 100%;\n      height: 30px;\n      font-size: 20px;\n      text-align: center;\n    }\n    \n    .search-result{\n      border-bottom: 1px solid gray;\n      border-left: 1px solid gray;\n      border-right: 1px solid gray;\n      width:195px;\n      height: 16px;\n      padding: 5px;\n      background-color: white;\n      cursor: pointer;\n    }\n\n    .search-result:hover {\n      color: #eee;\n      background-color: #607D8B;\n    }\n  "],
        providers: [disease_search_service_1.DiseaseSearchService]
    }),
    __metadata("design:paramtypes", [disease_search_service_1.DiseaseSearchService, router_1.Router])
], DiseaseSelectionComponent);
exports.DiseaseSelectionComponent = DiseaseSelectionComponent;
//# sourceMappingURL=disease-selection.component.js.map