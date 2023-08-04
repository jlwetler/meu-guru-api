import { PrismaClient } from '@prisma/client';
import * as faker from 'faker-br';
import * as dotenv from 'dotenv';

const prisma  = new PrismaClient();

const fakerUser = (): any => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: `#${faker.internet.password()}123!`,
  cpf: faker.br.cpf(),
  phone:faker.helpers.replaceSymbolWithNumber('###########')
});

async function seed() {
const fakerRounds = 25;
dotenv.config();
console.log('Seeding...');

for (let i = 0; i < fakerRounds; i++) {
await prisma.user.create({ data: fakerUser() });
}
}
  
seed()
.catch((e) => console.error(e))
.finally(async () => {
await prisma.$disconnect();
});
