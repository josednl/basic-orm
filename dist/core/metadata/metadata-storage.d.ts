export interface ColumnMetadata {
    propertyKey: string | symbol;
    name: string;
    type: string;
    nullable: boolean;
}
export interface PrimaryColumnMetadata {
    propertyKey: string | symbol;
    name: string;
    type: string;
}
export interface EntityMetadata {
    target: Function;
    tableName: string;
    columns: ColumnMetadata[];
    primaryColumns: PrimaryColumnMetadata[];
    primaryGeneratedColumn?: PrimaryColumnMetadata;
}
export declare class MetadataStorage {
    private entities;
    getMetadata(target: Function): EntityMetadata | undefined;
    addEntity(target: Function): EntityMetadata;
    getEntities(): EntityMetadata[];
}
export declare const metadataStorage: MetadataStorage;
//# sourceMappingURL=metadata-storage.d.ts.map