import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "generated/prisma/client";
import { sqlConfig } from "src/config/database.config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    constructor(){
        super({
            adapter: new PrismaMssql(sqlConfig)
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}