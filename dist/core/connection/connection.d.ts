import { Pool } from "pg";
export interface ConnectionOptions {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
}
export declare class Connection {
    private pool;
    connect(options: ConnectionOptions): Promise<void>;
    getPool(): Pool;
    query(text: string, params?: any[]): Promise<any[]>;
    close(): Promise<void>;
}
export declare const connection: Connection;
//# sourceMappingURL=connection.d.ts.map