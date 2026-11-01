"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./src/lib/prisma");
async function check() {
    const accounts = await prisma_1.prisma.chartOfAccount.findMany();
    console.log("ChartOfAccount:", accounts);
    const services = await prisma_1.prisma.serviceCategory.findMany();
    console.log("ServiceCategory:", services);
}
check().finally(() => prisma_1.prisma.$disconnect());
