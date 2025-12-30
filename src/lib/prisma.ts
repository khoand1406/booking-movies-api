import { PrismaClient } from "generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { pool } from '../config/database.config';

const adapter = new PrismaMssql(pool as any);
const prisma = new PrismaClient({ adapter });
export default prisma;