import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole, DocumentType } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentsController {
    constructor(private documentsService: DocumentsService) { }

    @Post()
    @ApiOperation({ summary: 'Загрузить документ (метаданные)' })
    async create(
        @Body() dto: {
            type: DocumentType;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            orderId?: string;
        },
        @Request() req: any,
    ) {
        return this.documentsService.create({
            ...dto,
            uploadedById: req.user.sub,
        });
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Получить документы заявки' })
    async findByOrder(@Param('orderId') orderId: string) {
        return this.documentsService.findByOrder(orderId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить документ по ID' })
    async findOne(@Param('id') id: string) {
        return this.documentsService.findById(id);
    }

    @Put(':id/verify')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Верифицировать документ' })
    async verify(@Param('id') id: string) {
        return this.documentsService.verify(id);
    }

    @Get('power-of-attorney/:orderId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Генерация доверенности (данные для PDF)' })
    async generatePowerOfAttorney(@Param('orderId') orderId: string) {
        return this.documentsService.generatePowerOfAttorney(orderId);
    }
}
