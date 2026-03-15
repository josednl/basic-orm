import "reflect-metadata";

export function Entity(tableName?: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("orm:entity", true, target);
    Reflect.defineMetadata("orm:tableName", tableName || target.name.toLowerCase(), target);
  };
}

export function Column(options?: { name?: string; type?: string; nullable?: boolean }): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const columns = Reflect.getMetadata("orm:columns", target.constructor) || [];
    columns.push({
      propertyKey,
      name: options?.name || String(propertyKey),
      type: options?.type || "varchar",
      nullable: options?.nullable ?? true,
    });
    Reflect.defineMetadata("orm:columns", columns, target.constructor);
  };
}

export function PrimaryColumn(options?: { name?: string; type?: string }): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const primaryColumns = Reflect.getMetadata("orm:primaryColumns", target.constructor) || [];
    primaryColumns.push({
      propertyKey,
      name: options?.name || String(propertyKey),
      type: options?.type || "int",
    });
    Reflect.defineMetadata("orm:primaryColumns", primaryColumns, target.constructor);
  };
}

export function PrimaryGeneratedColumn(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata("orm:primaryGeneratedColumn", {
      propertyKey,
      name: String(propertyKey),
      type: "int",
    }, target.constructor);
  };
}
