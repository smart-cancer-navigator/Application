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
var core_1 = require("@angular/core");
var DiseaseSelectionComponent = (function () {
    function DiseaseSelectionComponent() {
    }
    DiseaseSelectionComponent.prototype.ngOnInit = function () {
    };
    return DiseaseSelectionComponent;
}());
DiseaseSelectionComponent = __decorate([
    core_1.Component({
        selector: 'disease-selection',
        template: "    \n    <h1>Select Patient Disease</h1>\n    <filterable-dropdown></filterable-dropdown>\n  ",
        styles: ["    \n  "]
    })
], DiseaseSelectionComponent);
exports.DiseaseSelectionComponent = DiseaseSelectionComponent;
//# sourceMappingURL=disease-selection.component.js.map