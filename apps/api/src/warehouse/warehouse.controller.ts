import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WarehouseController {
    constructor(private warehouseService: WarehouseService) { }

    @Get('queue/:locationId')
    @Roles(UserRole.ADMIN, UserRole.WAREHOUSE)
    @ApiOperation({ summary: 'Получить очередь машин на складе' })
    async getQueue(@Param('locationId') locationId: string) {
        return this.warehouseService.getQueue(locationId);
    }

    @Post('arrived/:orderId')
    @Roles(UserRole.DRIVER)
    @ApiOperation({ summary: 'Водитель прибыл на склад' })
    async driverArrived(@Param('orderId') orderId: string) {
        return this.warehouseService.driverArrived(orderId);
    }

    @Put('assign-gate/:queueItemId')
    @Roles(UserRole.WAREHOUSE)
    @ApiOperation({ summary: 'Назначить ворота' })
    async assignGate(
        @Param('queueItemId') queueItemId: string,
        @Body() dto: { gateId: string; instructions?: string },
    ) {
        return this.warehouseService.assignGate(queueItemId, dto.gateId, dto.instructions);
    }

    @Put('start-loading/:queueItemId')
    @Roles(UserRole.WAREHOUSE)
    @ApiOperation({ summary: 'Начать погрузку' })
    async startLoading(@Param('queueItemId') queueItemId: string) {
        return this.warehouseService.startLoading(queueItemId);
    }

    @Put('complete-loading/:queueItemId')
    @Roles(UserRole.WAREHOUSE, UserRole.DRIVER)
    @ApiOperation({ summary: 'Завершить погрузку' })
    async completeLoading(@Param('queueItemId') queueItemId: string) {
        return this.warehouseService.completeLoading(queueItemId);
    }

    @Get('gates/:locationId')
    @Roles(UserRole.ADMIN, UserRole.WAREHOUSE)
    @ApiOperation({ summary: 'Получить ворота склада' })
    async getGates(@Param('locationId') locationId: string) {
        return this.warehouseService.getGates(locationId);
    }

    @Post('gates/:locationId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Создать ворота склада' })
    async createGate(
        @Param('locationId') locationId: string,
        @Body() dto: { gateNumber: string },
    ) {
        return this.warehouseService.createGate(locationId, dto.gateNumber);
    }
}
