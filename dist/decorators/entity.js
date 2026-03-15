"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = Entity;
exports.Column = Column;
exports.PrimaryColumn = PrimaryColumn;
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
require("reflect-metadata");
function Entity(tableName) {
    return (target) => {
        Reflect.defineMetadata("orm:entity", true, target);
        Reflect.defineMetadata("orm:tableName", tableName || target.name.toLowerCase(), target);
    };
}
function Column(options) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata("orm:columns", target.constructor) || [];
        columns.push({
            propertyKey,
            name: options?.name || String(propertyKey),
            type: options?.type || "varchar",
            nullable: options?.nullable ?? true,
        });
        Reflect.defineMetadata("orm:columns", columns, target.constructor);
    };
}
function PrimaryColumn(options) {
    return (target, propertyKey) => {
        const primaryColumns = Reflect.getMetadata("orm:primaryColumns", target.constructor) || [];
        primaryColumns.push({
            propertyKey,
            name: options?.name || String(propertyKey),
            type: options?.type || "int",
        });
        Reflect.defineMetadata("orm:primaryColumns", primaryColumns, target.constructor);
    };
}
function PrimaryGeneratedColumn() {
    return (target, propertyKey) => {
        Reflect.defineMetadata("orm:primaryGeneratedColumn", {
            propertyKey,
            name: String(propertyKey),
            type: "int",
        }, target.constructor);
    };
}
//# sourceMappingURL=entity.js.map