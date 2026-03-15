"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataStorage = exports.MetadataStorage = void 0;
class MetadataStorage {
    constructor() {
        this.entities = new Map();
    }
    getMetadata(target) {
        return this.entities.get(target.name);
    }
    addEntity(target) {
        const tableName = Reflect.getMetadata("orm:tableName", target);
        const columns = (Reflect.getMetadata("orm:columns", target) || []);
        const primaryColumns = (Reflect.getMetadata("orm:primaryColumns", target) || []);
        const primaryGeneratedColumn = Reflect.getMetadata("orm:primaryGeneratedColumn", target);
        const metadata = {
            target,
            tableName,
            columns,
            primaryColumns,
            primaryGeneratedColumn,
        };
        this.entities.set(target.name, metadata);
        return metadata;
    }
    getEntities() {
        return Array.from(this.entities.values());
    }
}
exports.MetadataStorage = MetadataStorage;
exports.metadataStorage = new MetadataStorage();
//# sourceMappingURL=metadata-storage.js.map