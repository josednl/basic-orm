"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("./index");
let User = class User {
};
__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, index_1.Column)({ name: "name", type: "varchar" }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, index_1.Column)({ name: "email", type: "varchar" }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, index_1.Column)({ name: "age", type: "int", nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
User = __decorate([
    (0, index_1.Entity)("users")
], User);
async function main() {
    await index_1.connection.connect({
        host: "localhost",
        port: 5432,
        database: "test_db",
        user: "postgres",
        password: "password",
    });
    const userRepo = new index_1.Repository(User);
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
    await index_1.connection.close();
}
main().catch(console.error);
//# sourceMappingURL=example.js.map