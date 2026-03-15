export interface WhereCondition {
    column: string;
    operator: string;
    value: any;
}
export declare class QueryBuilder {
    private queryType;
    private tableName;
    private selectColumns;
    private whereConditions;
    private insertData;
    private updateData;
    private returningColumns;
    constructor(entity: Function);
    select(...columns: string[]): this;
    insert(data: Record<string, any>): this;
    update(data: Record<string, any>): this;
    delete(): this;
    where(column: string, operator: string, value: any): this;
    returning(...columns: string[]): this;
    build(): {
        sql: string;
        params: any[];
    };
}
//# sourceMappingURL=query-builder.d.ts.map