import { connection } from "../core/connection/connection";
import { metadataStorage, EntityMetadata, ColumnMetadata, PrimaryColumnMetadata } from "../core/metadata/metadata-storage";
import { QueryBuilder } from "../core/query/query-builder";

export interface FindOptions {
  where?: Record<string, any>;
  orderBy?: Record<string, "ASC" | "DESC">;
  limit?: number;
  offset?: number;
}

export class Repository<T> {
  protected entity: Function;
  protected metadata: EntityMetadata;

  constructor(entityClass: Function) {
    this.entity = entityClass;
    this.metadata = metadataStorage.addEntity(entityClass);
  }

  private createQueryBuilder(): QueryBuilder {
    return new QueryBuilder(this.entity);
  }

  private mapRowToEntity(row: any): T {
    const instance = Object.create(this.entity.prototype);
    const allColumns = [...this.metadata.columns, ...this.metadata.primaryColumns];
    
    if (this.metadata.primaryGeneratedColumn) {
      allColumns.push(this.metadata.primaryGeneratedColumn);
    }

    for (const column of allColumns) {
      const value = row[column.name];
      if (value !== undefined) {
        (instance as any)[column.propertyKey] = value;
      }
    }
    return instance as T;
  }

  async save(data: Partial<T>): Promise<T> {
    const primaryColumns = [...this.metadata.primaryColumns];
    if (this.metadata.primaryGeneratedColumn) {
      primaryColumns.push(this.metadata.primaryGeneratedColumn);
    }
    
    const existing = primaryColumns.length > 0 
      ? await this.findOneBy(primaryColumns.reduce((acc, p) => ({ ...acc, [p.name]: (data as any)[p.propertyKey] }), {}))
      : null;

    let result: any;
    if (existing) {
      const updateData: Record<string, any> = {};
      for (const col of this.metadata.columns) {
        if ((data as any)[col.propertyKey] !== undefined) {
          updateData[col.name] = (data as any)[col.propertyKey];
        }
      }
      const primaryWhere = primaryColumns.map(p => `${p.name} = $${(data as any)[p.propertyKey]}`).join(" AND ");
      
      const { sql, params } = this.createQueryBuilder()
        .update(updateData)
        .where(primaryWhere, "=", (data as any)[primaryColumns[0].propertyKey])
        .returning("*")
        .build();
      
      result = await connection.query(sql, params);
    } else {
      const insertData: Record<string, any> = {};
      for (const col of this.metadata.columns) {
        if ((data as any)[col.propertyKey] !== undefined) {
          insertData[col.name] = (data as any)[col.propertyKey];
        }
      }
      for (const pcol of primaryColumns) {
        if ((data as any)[pcol.propertyKey] !== undefined) {
          insertData[pcol.name] = (data as any)[pcol.propertyKey];
        }
      }
      
      const { sql, params } = this.createQueryBuilder()
        .insert(insertData)
        .returning("*")
        .build();
      
      result = await connection.query(sql, params);
    }

    return this.mapRowToEntity(result[0]);
  }

  async findOne(conditions: Record<string, any>): Promise<T | null> {
    const whereClauses = Object.entries(conditions)
      .map(([key, value], index) => ({ key, value, index }))
      .reduce((acc, { key, value, index }) => `${acc}${index > 0 ? " AND " : ""}${key} = $${index + 1}`, "");

    const { sql, params } = this.createQueryBuilder()
      .select("*")
      .where(whereClauses, "=", conditions[Object.keys(conditions)[0]])
      .build();

    const result = await connection.query(sql, params);
    return result.length > 0 ? this.mapRowToEntity(result[0]) : null;
  }

  async findOneBy(conditions: Record<string, any>): Promise<T | null> {
    const { sql, params } = this.createQueryBuilder()
      .select("*")
      .build();

    const whereClauses = Object.entries(conditions).map(([key, value], index) => {
      params.push(value);
      return `${key} = $${index + 1}`;
    }).join(" AND ");

    const finalSql = sql.replace("FROM", `FROM (SELECT * FROM ${this.metadata.tableName} WHERE ${whereClauses})`);
    const result = await connection.query(finalSql, params);
    return result.length > 0 ? this.mapRowToEntity(result[0]) : null;
  }

  async findMany(options?: FindOptions): Promise<T[]> {
    let sql = `SELECT * FROM ${this.metadata.tableName}`;
    const params: any[] = [];

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

    const result = await connection.query(sql, params);
    return result.map((row: any) => this.mapRowToEntity(row));
  }

  async delete(conditions: Record<string, any>): Promise<boolean> {
    const { sql, params } = this.createQueryBuilder()
      .delete()
      .build();

    const whereClauses = Object.entries(conditions).map(([key, value], index) => {
      params.push(value);
      return `${key} = $${index + 1}`;
    }).join(" AND ");

    const finalSql = sql.replace("FROM", `FROM ${this.metadata.tableName} WHERE ${whereClauses}`);
    const result = await connection.query(finalSql, params);
    return result.length > 0;
  }
}
