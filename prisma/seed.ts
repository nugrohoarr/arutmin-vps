import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      id: "e7553f29-c7b0-4e81-8fbb-9272b4e36a41",
      fullName: 'Nirwan Surahman',
      email: 'nirwan.surahman@arutmin.com',
      noHp: '+62 2157945678',
      password: '$2b$10$GO7C7pt6BTq51JgtKAJ4VeicmFzVLBNODC9U5WnGwWbi5vlIrMmK2', 
      role: 'MASYARAKAT', 
    },
  });

  const contact = await prisma.contact.create({
    data: {
      id: 1,
      address: 'PT Arutmin Indonesia Tambang Senakin Gedung Bakrie Tower Lantai 14 Rasuna Epicentrum Jl. Hr. Rasuna Said, Jakarta 12940',
      phone: '+62 21 5794 5678',
      fax: '+62 21 5794 5678',
      email: 'nirwan.surahman@arutmin.com',
      instagram: '@arutmin_senakin',
      facebook: '@arutmin_senakin',
    }
  })

  console.log({ user, contact });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
