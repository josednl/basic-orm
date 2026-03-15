"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const metadata_storage_1 = require("../metadata/metadata-storage");
class QueryBuilder {
    constructor(entity) {
        this.queryType = "select";
        this.tableName = "";
        this.selectColumns = [];
        this.whereConditions = [];
        this.insertData = {};
        this.updateData = {};
        this.returningColumns = [];
        const metadata = metadata_storage_1.metadataStorage.getMetadata(entity);
        if (!metadata) {
            throw new Error(`Entity ${entity.name} not registered`);
        }
        this.tableName = metadata.tableName;
    }
    select(...columns) {
        this.queryType = "select";
        this.selectColumns = columns.length > 0 ? columns : ["*"];
        return this;
    }
    insert(data) {
        this.queryType = "insert";
        this.insertData = data;
        return this;
    }
    update(data) {
        this.queryType = "update";
        this.updateData = data;
        return this;
    }
    delete() {
        this.queryType = "delete";
        return this;
    }
    where(column, operator, value) {
        this.whereConditions.push({ column, operator, value });
        return this;
    }
    returning(...columns) {
        this.returningColumns = columns;
        return this;
    }
    build() {
        let sql = "";
        const params = [];
        let paramIndex = 1;
        switch (this.queryType) {
            case "select":
                sql = `SELECT ${this.selectColumns.join(", ")} FROM ${this.tableName}`;
                break;
            case "insert":
                const insertKeys = Object.keys(this.insertData);
                const insertValues = Object.values(this.insertData);
                sql = `INSERT INTO ${this.tableName} (${insertKeys.join(", ")}) VALUES (${insertValues.map((_, i) => `$${paramIndex + i}`).join(", ")})`;
                params.push(...insertValues);
                paramIndex += insertValues.length;
                break;
            case "update":
                const updateKeys = Object.keys(this.updateData);
                const updateValues = Object.values(this.updateData);
                const setClause = updateKeys.map((key, i) => `${key} = $${paramIndex + i}`).join(", ");
                sql = `UPDATE ${this.tableName} SET ${setClause}`;
                params.push(...updateValues);
                paramIndex += updateValues.length;
                break;
            case "delete":
                sql = `DELETE FROM ${this.tableName}`;
                break;
        }
        if (this.whereConditions.length > 0) {
            const whereClause = this.whereConditions.map((cond) => {
                const value = cond.value;
                params.push(value);
                return `${cond.column} ${cond.operator} $${paramIndex++}`;
            }).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }
        if (this.returningColumns.length > 0) {
            sql += ` RETURNING ${this.returningColumns.join(", ")}`;
        }
        return { sql, params };
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=query-builder.js.map