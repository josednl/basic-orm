# Basic ORM

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D%2012.0-blue)](https://www.postgresql.org/)

A lightweight Object-Relational Mapping (ORM) library for TypeScript with PostgreSQL support.

## Features

- 🚀 Simple and intuitive API
- 📦 Decorator-based entity definitions
- 🔗 Automatic metadata handling
- 💾 Repository pattern for data access
- 🐘 PostgreSQL driver integration
- 🏗️ Query builder for complex queries
- 🧩 TypeScript-first design

## Installation

```bash
npm install basic-orm
```

## Quick Start

### 1. Define your entities

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'basic-orm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;
}
```

### 2. Configure the connection

```typescript
import { connection, ConnectionOptions } from 'basic-orm';

const options: ConnectionOptions = {
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [User], // Register your entities
  synchronize: true, // Auto-create tables (use with caution in production)
};

await connection.initialize(options);
```

### 3. Use repositories to interact with data

```typescript
import { getRepository } from 'basic-orm';

// Get a repository for the User entity
const userRepository = getRepository(User);

// Create a new user
const newUser = new User();
newUser.name = 'John Doe';
newUser.email = 'john@example.com';
newUser.age = 30;

await userRepository.save(newUser);

// Find all users
const users = await userRepository.find();

// Find a user by ID
const user = await userRepository.findOne({ where: { id: 1 } });

// Update a user
user.age = 31;
await userRepository.save(user);

// Delete a user
await userRepository.remove(user);
```

### 4. Using the Query Builder

```typescript
import { getRepository } from 'basic-orm';

const userRepository = getRepository(User);

// Find users older than 18
const adults = await userRepository
  .createQueryBuilder()
  .where('age > :age', { age: 18 })
  .getMany();

// Find users with pagination
const usersPage = await userRepository
  .createQueryBuilder()
  .orderBy('id', 'ASC')
  .limit(10)
  .offset(0)
  .getMany();
```

## API Overview

### Decorators

- `@Entity(options?)` - Marks a class as an entity
- `@Column(options?)` - Marks a property as a database column
- `@PrimaryColumn()` - Marks a property as the primary key
- `@PrimaryGeneratedColumn()` - Marks a property as an auto-increment primary key

### Connection

- `initialize(options: ConnectionOptions)` - Initializes the database connection
- `close()` - Closes the database connection
- `getConnection()` - Gets the active connection instance

### Repository

- `save(entity)` - Saves an entity (insert or update)
- `find(options?)` - Finds entities based on options
- `findOne(options?)` - Finds a single entity
- `findByIds(ids)` - Finds entities by their IDs
- `create(entityLike)` - Creates a new entity instance
- `merge(entity, entityLike)` - Merges two entities
- `remove(entity)` - Removes an entity from the database
- `count(options?)` - Counts entities matching criteria
- `exists(options?)` - Checks if an entity exists
- `createQueryBuilder()` - Creates a query builder instance

### Query Builder

- `select(fields)` - Specifies fields to select
- `where(condition, parameters?)` - Adds WHERE conditions
- `andWhere(condition, parameters?)` - Adds AND WHERE conditions
- `orWhere(condition, parameters?)` - Adds OR WHERE conditions
- `orderBy(field, direction)` - Adds ORDER BY clause
- `groupBy(field)` - Adds GROUP BY clause
- `having(condition, parameters?)` - Adds HAVING condition
- `limit(number)` - Limits the number of results
- `offset(number)` - Skips a number of results
- `getMany()` - Executes query and returns multiple results
- `getOne()` - Executes query and returns single result
- `getCount()` - Executes count query

## Configuration Options

### ConnectionOptions

| Property | Type | Description |
|----------|------|-------------|
| host | string | Database host |
| port | number | Database port |
| username | string | Database username |
| password | string | Database password |
| database | string | Database name |
| entities | Function[] | Array of entity classes |
| synchronize | boolean | Auto-sync database schema (dev only) |
| logging | boolean | Enable query logging |

### ColumnOptions

| Property | Type | Description |
|----------|------|-------------|
| type | string | Column type (string, number, boolean, date, etc.) |
| primary | boolean | Marks column as primary key |
| generated | boolean | Marks column as auto-generated |
| nullable | boolean | Allows NULL values |
| unique | boolean | Enforces unique constraint |
| default | any | Default value for the column |
| length | number | Length for string types |
| precision | number | Precision for decimal types |
| scale | number | Scale for decimal types |

## Development

### Prerequisites

- Node.js >= 16.0.0
- PostgreSQL >= 12.0
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/josednl/basic-orm.git
cd basic-orm

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Running Examples

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Add or update tests as needed
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed
- Keep pull requests focused on a single feature or bug fix

Please make sure to update tests as appropriate.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. When reporting a bug, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Any relevant code snippets or error messages
- Your environment details (Node.js version, PostgreSQL version, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by popular ORMs like TypeORM and Sequelize
- Built with TypeScript for type safety and developer experience
- Uses `pg` for reliable PostgreSQL connectivity
