/**
 * This component contains the HTML for the filterable dropdown component employed when the user
 * selects the patient disease being observed, or the gene/variant/type queried from the
 * gene-database-manager service.
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
var dropdown_1 = require("./dropdown");
var FilterableDropdownComponent = (function () {
    function FilterableDropdownComponent() {
    }
    FilterableDropdownComponent.prototype.ngOnInit = function () {
    };
    return FilterableDropdownComponent;
}());
__decorate([
    core_1.Input() // Tells Angular that this property should be included in the selector declaration.
    ,
    __metadata("design:type", dropdown_1.Dropdown)
], FilterableDropdownComponent.prototype, "dropdownReference", void 0);
FilterableDropdownComponent = __decorate([
    core_1.Component({
        selector: 'filterable-dropdown',
        template: "    \n    <input type=\"text\" [(ngModel)]=\"dropdownReference.selected\" placeholder=\"{{dropdownReference.purpose}}\"/>\n    <div>\n      <button *ngFor=\"let option of dropdownReference.options\">{{option}}</button>\n    </div>\n  ",
        styles: ["\n  "]
    })
], FilterableDropdownComponent);
exports.FilterableDropdownComponent = FilterableDropdownComponent;
//# sourceMappingURL=filterable-dropdown.component.js.map