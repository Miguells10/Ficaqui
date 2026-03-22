import { PrismaClient, BuildingStatus, OwnerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding B2G Buildings Intelligence...');
  
  // Limpa as propriedades para evitar duplicatas em re-seeds do Docker
  await prisma.building.deleteMany();
  
  await prisma.building.create({
    data: {
      address: 'Praça Fausto Cardoso, 12',
      status: BuildingStatus.ABANDONED,
      ownerType: OwnerType.GOVERNMENT,
      taxDebt: 150000.0,
      footTrafficScore: 85,
      latitude: -10.9125,
      longitude: -37.0450
    }
  });

  await prisma.building.create({
    data: {
      address: 'Rua João Pessoa, 210',
      status: BuildingStatus.MIXED_USE_POTENTIAL,
      ownerType: OwnerType.PRIVATE,
      taxDebt: 45000.5,
      footTrafficScore: 92,
      latitude: -10.9110,
      longitude: -37.0465
    }
  });

  await prisma.building.create({
    data: {
      address: 'Palácio Olímpio Campos (Anexo B)',
      status: BuildingStatus.RETROFITTED,
      ownerType: OwnerType.GOVERNMENT,
      taxDebt: 0.0,
      footTrafficScore: 78,
      latitude: -10.9130,
      longitude: -37.0440
    }
  });

  await prisma.building.create({
    data: {
      address: 'Calçadão Laranjeiras, 400',
      status: BuildingStatus.ABANDONED,
      ownerType: OwnerType.PRIVATE,
      taxDebt: 320000.0,
      footTrafficScore: 98, // Extremamente movimentado
      latitude: -10.9100,
      longitude: -37.0470
    }
  });

  console.log('Seed completo ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
