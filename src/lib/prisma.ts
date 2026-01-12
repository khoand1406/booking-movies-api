import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "generated/prisma/client";
import { sqlConfig } from '../config/database.config';

const adapter = new PrismaMssql(sqlConfig); 
const prisma = new PrismaClient({ adapter });

export default prisma;