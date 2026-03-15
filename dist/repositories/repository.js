"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const connection_1 = require("../core/connection/connection");
const metadata_storage_1 = require("../core/metadata/metadata-storage");
const query_builder_1 = require("../core/query/query-builder");
class Repository {
    constructor(entityClass) {
        this.entity = entityClass;
        this.metadata = metadata_storage_1.metadataStorage.addEntity(entityClass);
    }
    createQueryBuilder() {
        return new query_builder_1.QueryBuilder(this.entity);
    }
    mapRowToEntity(row) {
        const instance = Object.create(this.entity.prototype);
        const allColumns = [...this.metadata.columns, ...this.metadata.primaryColumns];
        if (this.metadata.primaryGeneratedColumn) {
            allColumns.push(this.metadata.primaryGeneratedColumn);
        }
        for (const column of allColumns) {
            const value = row[column.name];
            if (value !== undefined) {
                instance[column.propertyKey] = value;
            }
        }
        return instance;
    }
    async save(data) {
        const primaryColumns = [...this.metadata.primaryColumns];
        if (this.metadata.primaryGeneratedColumn) {
            primaryColumns.push(this.metadata.primaryGeneratedColumn);
        }
        const existing = primaryColumns.length > 0
            ? await this.findOneBy(primaryColumns.reduce((acc, p) => ({ ...acc, [p.name]: data[p.propertyKey] }), {}))
            : null;
        let result;
        if (existing) {
            const updateData = {};
            for (const col of this.metadata.columns) {
                if (data[col.propertyKey] !== undefined) {
                    updateData[col.name] = data[col.propertyKey];
                }
            }
            const primaryWhere = primaryColumns.map(p => `${p.name} = $${data[p.propertyKey]}`).join(" AND ");
            const { sql, params } = this.createQueryBuilder()
                .update(updateData)
                .where(primaryWhere, "=", data[primaryColumns[0].propertyKey])
                .returning("*")
                .build();
            result = await connection_1.connection.query(sql, params);
        }
        else {
            const insertData = {};
            for (const col of this.metadata.columns) {
                if (data[col.propertyKey] !== undefined) {
                    insertData[col.name] = data[col.propertyKey];
                }
            }
            for (const pcol of primaryColumns) {
                if (data[pcol.propertyKey] !== undefined) {
                    insertData[pcol.name] = data[pcol.propertyKey];
                }
            }
            const { sql, params } = this.createQueryBuilder()
                .insert(insertData)
                .returning("*")
                .build();
            result = await connection_1.connection.query(sql, params);
        }
        return this.mapRowToEntity(result[0]);
    }
    async findOne(conditions) {
        const whereClauses = Object.entries(conditions)
            .map(([key, value], index) => ({ key, value, index }))
            .reduce((acc, { key, value, index }) => `${acc}${index > 0 ? " AND " : ""}${key} = $${index + 1}`, "");
        const { sql, params } = this.createQueryBuilder()
            .select("*")
            .where(whereClauses, "=", conditions[Object.keys(conditions)[0]])
            .build();
        const result = await connection_1.connection.query(sql, params);
        return result.length > 0 ? this.mapRowToEntity(result[0]) : null;
    }
    async findOneBy(conditions) {
        const { sql, params } = this.createQueryBuilder()
            .select("*")
            .build();
        const whereClauses = Object.entries(conditions).map(([key, value], index) => {
            params.push(value);
            return `${key} = $${index + 1}`;
        }).join(" AND ");
        const finalSql = sql.replace("FROM", `FROM (SELECT * FROM ${this.metadata.tableName} WHERE ${whereClauses})`);
        const result = await connection_1.connection.query(finalSql, params);
        return result.length > 0 ? this.mapRowToEntity(result[0]) : null;
    }
    async findMany(options) {
        let sql = `SELECT * FROM ${this.metadata.tableName}`;
        const params = [];
        if (options?.where) {
            const whereClauses = Object.entries(options.where).map(([key, value], index) => {
                params.push(value);
                return `${key} = $${index + 1}`;
            }).join(" AND ");
            sql += ` WHERE ${whereClauses}`;
        }
        if (options?.orderBy) {
            const orderClauses = Object.entries(options.orderBy).map(([key, value]) => `${key} ${value}`).join(", ");
            sql += ` ORDER BY ${orderClauses}`;
        }
        if (options?.limit) {
            sql += ` LIMIT ${options.limit}`;
        }
        if (options?.offset) {
            sql += ` OFFSET ${options.offset}`;
        }
        const result = await connection_1.connection.query(sql, params);
        return result.map((row) => this.mapRowToEntity(row));
    }
    async delete(conditions) {
        const { sql, params } = this.createQueryBuilder()
            .delete()
            .build();
        const whereClauses = Object.entries(conditions).map(([key, value], index) => {
            params.push(value);
            return `${key} = $${index + 1}`;
        }).join(" AND ");
        const finalSql = sql.replace("FROM", `FROM ${this.metadata.tableName} WHERE ${whereClauses}`);
        const result = await connection_1.connection.query(finalSql, params);
        return result.length > 0;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map