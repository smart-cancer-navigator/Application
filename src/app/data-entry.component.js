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
require("rxjs/add/operator/switchMap");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var disease_search_service_1 = require("./disease-search.service");
var DataEntryComponent = (function () {
    function DataEntryComponent(diseaseService, route, location) {
        this.diseaseService = diseaseService;
        this.route = route;
        this.location = location;
    }
    DataEntryComponent.prototype.ngOnInit = function () {
    };
    DataEntryComponent.prototype.goBack = function () {
        this.location.back();
    };
    return DataEntryComponent;
}());
DataEntryComponent = __decorate([
    core_1.Component({
        selector: 'data-entry',
        template: "    \n    \n  ",
        styles: ["\n    \n  "]
    }),
    __metadata("design:paramtypes", [disease_search_service_1.DiseaseSearchService,
        router_1.ActivatedRoute,
        common_1.Location])
], DataEntryComponent);
exports.DataEntryComponent = DataEntryComponent;
//# sourceMappingURL=data-entry.component.js.map