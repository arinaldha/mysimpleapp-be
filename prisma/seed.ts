import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
const prisma = new PrismaClient()
async function main() {
  await prisma.roles.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Super Admin',
    },
  })

  await prisma.roles.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'User',
    },
  })

  await prisma.users.upsert({
    where: { email: 'superadmin@myapp.xyz' },
    update: {},
    create: {
      email: 'superadmin@myapp.xyz',
      name: 'Super Admin',
      phone: '0812345678',
      gender: 'Male',
      password:  await bcrypt.hash('MyApp123!', 10),
      role_id: 1,
      created_at: new Date()
    },
  })

  await prisma.users.upsert({
    where: { email: 'user1@myapp.xyz' },
    update: {},
    create: {
      email: 'user1@myapp.xyz',
      name: 'User1',
      phone: '08123456789',
      gender: 'Female',
      password:  await bcrypt.hash('MyApp123!', 10),
      role_id: 2,
      created_at: new Date()
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })