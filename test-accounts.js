const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.chartOfAccount.findMany().then(res => { console.log("ChartOfAccount:", res); prisma.$disconnect(); });
prisma.serviceCategory.findMany().then(res => { console.log("ServiceCategory:", res); prisma.$disconnect(); });
