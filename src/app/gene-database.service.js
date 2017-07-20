/**
 * The gene database is a base class which represents a database such as CIViC, MyCancerGenome, CADD,
 * etc., while providing a universal format for the database GET methods to follow.  This functionality
 * ensures that a developer can, in the future, write a single class and reference it in the manager to
 * add the full functionality of another database.
 */
"use strict";
var GeneDatabaseService = (function () {
    function GeneDatabaseService() {
    }
    return GeneDatabaseService;
}());
exports.GeneDatabaseService = GeneDatabaseService;
//# sourceMappingURL=gene-database.service.js.map