import { EntityMetadata, metadataStorage } from "../metadata/metadata-storage";

export interface WhereCondition {
  column: string;
  operator: string;
  value: any;
}

export class QueryBuilder {
  private queryType: "select" | "insert" | "update" | "delete" = "select";
  private tableName: string = "";
  private selectColumns: string[] = [];
  private whereConditions: WhereCondition[] = [];
  private insertData: Record<string, any> = {};
  private updateData: Record<string, any> = {};
  private returningColumns: string[] = [];

  constructor(entity: Function) {
    const metadata = metadataStorage.getMetadata(entity);
    if (!metadata) {
      throw new Error(`Entity ${entity.name} not registered`);
    }
    this.tableName = metadata.tableName;
  }

  select(...columns: string[]): this {
    this.queryType = "select";
    this.selectColumns = columns.length > 0 ? columns : ["*"];
    return this;
  }

  insert(data: Record<string, any>): this {
    this.queryType = "insert";
    this.insertData = data;
    return this;
  }

  update(data: Record<string, any>): this {
    this.queryType = "update";
    this.updateData = data;
    return this;
  }

  delete(): this {
    this.queryType = "delete";
    return this;
  }

  where(column: string, operator: string, value: any): this {
    this.whereConditions.push({ column, operator, value });
    return this;
  }

  returning(...columns: string[]): this {
    this.returningColumns = columns;
    return this;
  }

  build(): { sql: string; params: any[] } {
    let sql = "";
    const params: any[] = [];
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
