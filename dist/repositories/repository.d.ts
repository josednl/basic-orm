import { EntityMetadata } from "../core/metadata/metadata-storage";
export interface FindOptions {
    where?: Record<string, any>;
    orderBy?: Record<string, "ASC" | "DESC">;
    limit?: number;
    offset?: number;
}
export declare class Repository<T> {
    protected entity: Function;
    protected metadata: EntityMetadata;
    constructor(entityClass: Function);
    private createQueryBuilder;
    private mapRowToEntity;
    save(data: Partial<T>): Promise<T>;
    findOne(conditions: Record<string, any>): Promise<T | null>;
    findOneBy(conditions: Record<string, any>): Promise<T | null>;
    findMany(options?: FindOptions): Promise<T[]>;
    delete(conditions: Record<string, any>): Promise<boolean>;
}
//# sourceMappingURL=repository.d.ts.map