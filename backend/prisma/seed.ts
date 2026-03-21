import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a plantação de dados (Seed)...');

  // Verifica se o usuário de teste já existe pra não duplicar
  const existingUser = await prisma.user.findUnique({
    where: { id: 'mobile-demo-user-123' }
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        id: 'mobile-demo-user-123', // ID usado hardcoded no frontend MVP
        name: 'Miguel (Hackers)',
        centroCoins: 1500, // Rico em moedas pro MVP rs
      },
    });
    console.log(`✅ Usuário criado: ${user.name} com ${user.centroCoins} moedas.`);
  } else {
    console.log(`⚠️ Usuário de teste já existe.`);
  }

  // 2. Lojas na Região do Centro (Próximas à Praça Fausto Cardoso)
  const stores = [
    {
      name: 'Loja do Seu João',
      category: 'Utilidades Domésticas',
      latitude: -10.9128,
      longitude: -37.0452,
      products: {
        create: [
          { name: 'Panela de Pressão Tramontina 4L', description: 'Segura, forte e ideal para feijão rápido no calor.', price: 95.9, stock: 12 },
          { name: 'Ventilador Arno Turbo', description: 'Silencioso, 40cm, seu salvador pro calor sergipano.', price: 180.0, stock: 5 },
          { name: 'Garrafa Térmica Soprano 1L', description: 'Conserva o café do escritório e água gelada bem geladinha.', price: 45.0, stock: 20 },
        ],
      },
    },
    {
      name: 'Armazém da Tecnologia',
      category: 'Eletrônicos e Celulares',
      latitude: -10.9135,
      longitude: -37.0448,
      products: {
        create: [
          { name: 'Carregador Tipo C Rápido', description: 'Carregador turbo 20w, não descarregue no ônibus.', price: 35.0, stock: 50 },
          { name: 'Fone de Ouvido Bluetooth JBL', description: 'Sem fio, bateria de 40h, com cancelamento de ruído urbano.', price: 120.0, stock: 15 },
          { name: 'Powerbank Portátil 10000mAh', description: 'Bateria extra para longas caminhadas no Sol.', price: 89.9, stock: 8 },
        ],
      },
    },
    {
      name: 'Armarinho e Papelaria Central',
      category: 'Armarinho e Variedades',
      latitude: -10.9118,
      longitude: -37.0460,
      products: {
        create: [
          { name: 'Kit Agulhas Crochê', description: '12 tamanhos diversos.', price: 25.0, stock: 30 },
          { name: 'Adesivos Cola e Brilho', description: 'Pacote artesanal escolar.', price: 12.5, stock: 45 },
          { name: 'Tesoura de Costura Titanium', description: 'Corte preciso em tecidos grossos.', price: 22.0, stock: 10 },
        ],
      },
    }
  ];

  for (const storeData of stores) {
    const store = await prisma.store.create({
      data: storeData,
    });
    console.log(`✅ Loja cadastrada pro mapa: ${store.name} (Injetado com ${storeData.products.create.length} produtos).`);
  }

  console.log('🚀 Seed do MVP populado 100% com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
