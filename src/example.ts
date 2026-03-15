import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, connection, Repository } from "./index";

@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", type: "varchar" })
  name!: string;

  @Column({ name: "email", type: "varchar" })
  email!: string;

  @Column({ name: "age", type: "int", nullable: true })
  age?: number;
}

async function main() {
  await connection.connect({
    host: "localhost",
    port: 5432,
    database: "test_db",
    user: "postgres",
    password: "password",
  });

  const userRepo = new Repository<User>(User);

  const newUser = await userRepo.save({
    name: "John Doe",
    email: "john@example.com",
    age: 25,
  });
  console.log("Created user:", newUser);

  const foundUser = await userRepo.findOneBy({ id: 1 });
  console.log("Found user:", foundUser);

  const allUsers = await userRepo.findMany({ orderBy: { name: "ASC" }, limit: 10 });
  console.log("All users:", allUsers);

  await userRepo.save({ ...newUser, age: 26 });
  console.log("Updated user");

  await userRepo.delete({ id: 1 });
  console.log("Deleted user");

  await connection.close();
}

main().catch(console.error);
