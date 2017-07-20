/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var InfoHeaderComponent = (function () {
    function InfoHeaderComponent() {
    }
    return InfoHeaderComponent;
}());
InfoHeaderComponent = __decorate([
    core_1.Component({
        selector: 'info-header',
        template: "\n    <div id=\"header\">\n      <img id=\"smartLogo\" src=\"assets/smart-logo.png\">\n      <p id=\"patientHeader\">John Smith - Age 42 - Thyroid Cancer</p>\n      <p id=\"userHeader\">Rebecca Cohen, M.D.</p>\n    </div>\n  ",
        styles: ["\n    #header {\n      height: 100px;\n      width: 100%;\n      display: flex;\n      align-items: center;\n\n      background-color: #dbdbdb;\n      padding: 5px;\n      text-align: center;\n    }\n\n    #header * {\n      margin: 0;\n      float: left;\n    }\n\n    #header p {\n      font-size: 30px;\n    }\n\n    #smartLogo {\n      width: auto;\n      height: 75%;\n    }\n\n    #patientHeader {\n      width: 60%;\n      color: #fff;\n    }\n\n    #userHeader {\n      width: 30%;\n      color: #fff;\n    }\n  "]
    })
], InfoHeaderComponent);
exports.InfoHeaderComponent = InfoHeaderComponent;
//# sourceMappingURL=info-header.component.js.map