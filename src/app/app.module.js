"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Modules
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_routing_module_1 = require("./app-routing.module");
// Components
var app_component_1 = require("./app.component");
var filterable_dropdown_component_1 = require("./filterable-dropdown.component");
var info_header_component_1 = require("./info-header.component");
var disease_selection_component_1 = require("./disease-selection.component");
var data_entry_component_1 = require("./data-entry.component");
// Services
var gene_database_manager_service_1 = require("./gene-database-manager.service");
var gene_database_service_1 = require("./gene-database.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            filterable_dropdown_component_1.FilterableDropdownComponent,
            info_header_component_1.InfoHeaderComponent,
            data_entry_component_1.DataEntryComponent,
            disease_selection_component_1.DiseaseSelectionComponent
        ],
        providers: [
            gene_database_manager_service_1.GeneDatabaseManager,
            gene_database_service_1.GeneDatabaseService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map