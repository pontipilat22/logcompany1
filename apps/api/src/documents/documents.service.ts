import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType } from '@prisma/client';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Сохранение информации о загруженном документе
     */
    async create(data: {
        type: DocumentType;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        orderId?: string;
        uploadedById: string;
    }) {
        return this.prisma.document.create({ data });
    }

    /**
     * Получение документов заявки
     */
    async findByOrder(orderId: string) {
        return this.prisma.document.findMany({
            where: { orderId },
            include: { uploadedBy: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Получение документа по ID
     */
    async findById(id: string) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: { order: true, uploadedBy: true },
        });

        if (!doc) {
            throw new NotFoundException('Документ не найден');
        }

        return doc;
    }

    /**
     * Верификация документа админом
     */
    async verify(id: string) {
        return this.prisma.document.update({
            where: { id },
            data: {
                isVerified: true,
                verifiedAt: new Date(),
            },
        });
    }

    /**
     * Генерация доверенности (возвращает данные для PDF)
     */
    async generatePowerOfAttorney(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                driver: true,
                customer: { include: { company: true } },
                pickupLocation: true,
                deliveryPoints: { include: { location: true } },
            },
        });

        if (!order || !order.driver) {
            throw new NotFoundException('Заявка или водитель не найдены');
        }

        // Данные для генерации PDF
        return {
            orderNumber: order.orderNumber,
            date: new Date(),
            driver: {
                fullName: `${order.driver.lastName} ${order.driver.firstName} ${order.driver.middleName || ''}`.trim(),
                phone: order.driver.phone,
                vehiclePlate: order.driver.vehiclePlate,
                vehicleModel: order.driver.vehicleModel,
            },
            customer: order.customer,
            cargo: {
                description: order.cargoDescription,
                weight: order.cargoWeight,
                volume: order.cargoVolume,
            },
            pickupLocation: order.pickupLocation,
            deliveryPoints: order.deliveryPoints.map((p: any) => p.location),
        };
    }
}
