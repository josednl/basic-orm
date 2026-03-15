import { Pool, PoolConfig, PoolClient } from "pg";

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

export class Connection {
  private pool: Pool | null = null;

  async connect(options: ConnectionOptions): Promise<void> {
    const config: PoolConfig = {
      host: options.host,
      port: options.port,
      database: options.database,
      user: options.user,
      password: options.password,
      max: options.max || 20,
      idleTimeoutMillis: options.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: options.connectionTimeoutMillis || 2000,
    };

    this.pool = new Pool(config);
    await this.pool.connect();
    console.log("✅ Database connected successfully");
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.pool;
  }

  async query(text: string, params?: any[]): Promise<any[]> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }
    const result = await this.pool.query(text, params);
    return result.rows;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log("Database connection closed");
    }
  }
}

export const connection = new Connection();
