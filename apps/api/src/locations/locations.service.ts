import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contactName?: string;
        contactPhone?: string;
        notes?: string;
        createdById?: string;
    }) {
        return this.prisma.location.create({ data });
    }

    async findAll(search?: string) {
        return this.prisma.location.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                ],
            } : undefined,
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        return this.prisma.location.findUnique({ where: { id } });
    }

    async update(id: string, data: Partial<{
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contactName: string;
        contactPhone: string;
        notes: string;
    }>) {
        return this.prisma.location.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.location.delete({ where: { id } });
    }
}
