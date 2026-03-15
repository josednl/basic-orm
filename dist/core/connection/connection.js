"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.Connection = void 0;
const pg_1 = require("pg");
class Connection {
    constructor() {
        this.pool = null;
    }
    async connect(options) {
        const config = {
            host: options.host,
            port: options.port,
            database: options.database,
            user: options.user,
            password: options.password,
            max: options.max || 20,
            idleTimeoutMillis: options.idleTimeoutMillis || 30000,
            connectionTimeoutMillis: options.connectionTimeoutMillis || 2000,
        };
        this.pool = new pg_1.Pool(config);
        await this.pool.connect();
        console.log("✅ Database connected successfully");
    }
    getPool() {
        if (!this.pool) {
            throw new Error("Database not connected. Call connect() first.");
        }
        return this.pool;
    }
    async query(text, params) {
        if (!this.pool) {
            throw new Error("Database not connected. Call connect() first.");
        }
        const result = await this.pool.query(text, params);
        return result.rows;
    }
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log("Database connection closed");
        }
    }
}
exports.Connection = Connection;
exports.connection = new Connection();
//# sourceMappingURL=connection.js.map