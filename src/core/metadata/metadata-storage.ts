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

export class MetadataStorage {
  private entities: Map<string, EntityMetadata> = new Map();

  getMetadata(target: Function): EntityMetadata | undefined {
    return this.entities.get(target.name);
  }

  addEntity(target: Function): EntityMetadata {
    const tableName = Reflect.getMetadata("orm:tableName", target) as string;
    const columns = (Reflect.getMetadata("orm:columns", target) || []) as ColumnMetadata[];
    const primaryColumns = (Reflect.getMetadata("orm:primaryColumns", target) || []) as PrimaryColumnMetadata[];
    const primaryGeneratedColumn = Reflect.getMetadata("orm:primaryGeneratedColumn", target) as PrimaryColumnMetadata | undefined;

    const metadata: EntityMetadata = {
      target,
      tableName,
      columns,
      primaryColumns,
      primaryGeneratedColumn,
    };

    this.entities.set(target.name, metadata);
    return metadata;
  }

  getEntities(): EntityMetadata[] {
    return Array.from(this.entities.values());
  }
}

export const metadataStorage = new MetadataStorage();
