"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor() {
        this.nextRelations = [];
    }
    /**
     * Primes the specified relation(s) to be used in the next database operation.
     * Can be chained.
     */
    with(relations) {
        if (Array.isArray(relations)) {
            this.nextRelations.push(...relations);
        }
        else {
            this.nextRelations.push(relations);
        }
        return this;
    }
    /**
     * Gets and resets the relations primed using with()
     */
    getRelations() {
        const relations = this.nextRelations || [];
        this.nextRelations = [];
        return relations;
    }
}
exports.BaseRepository = BaseRepository;
