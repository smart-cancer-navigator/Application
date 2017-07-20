/**
 * The gene database manager is a service which uses the gene-database subservice to obtain genes and
 * variants from a variety of other databases.  It is employed to ensure that this application remains
 * as modular as possible, rather than leveraging a single class to do all the heavy lifting (which
 * would make quick additions and removals far more difficult).
 */
"use strict";
var GeneDatabaseManager = (function () {
    function GeneDatabaseManager() {
    }
    return GeneDatabaseManager;
}());
exports.GeneDatabaseManager = GeneDatabaseManager;
//# sourceMappingURL=gene-database-manager.service.js.map