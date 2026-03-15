import "reflect-metadata";
export declare function Entity(tableName?: string): ClassDecorator;
export declare function Column(options?: {
    name?: string;
    type?: string;
    nullable?: boolean;
}): PropertyDecorator;
export declare function PrimaryColumn(options?: {
    name?: string;
    type?: string;
}): PropertyDecorator;
export declare function PrimaryGeneratedColumn(): PropertyDecorator;
//# sourceMappingURL=entity.d.ts.map