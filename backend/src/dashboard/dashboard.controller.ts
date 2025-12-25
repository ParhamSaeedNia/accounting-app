import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/response/dashboard-response.dto';
import { TransactionFilterDto } from '../transactions/dto/request/transaction-filter.dto';
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  //---------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiOkResponse({
    description: 'Dashboard summary with all key metrics',
    type: DashboardResponseDto,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for period analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for period analysis',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by transaction type',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Filter by tags (comma-separated)',
  })
  async getDashboard(
    @Query() filters: TransactionFilterDto,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(filters);
  }
  //---------------------------------------------
  @Get('teacher-salaries')
  @ApiOperation({ summary: 'Get teacher salary breakdown' })
  @ApiOkResponse({
    description: 'Teacher salary breakdown for the period',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for period analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for period analysis',
  })
  async getTeacherSalaryBreakdown(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // If no dates provided, return all-time data
    const periodStart = startDate ? new Date(startDate) : undefined;
    const periodEnd = endDate ? new Date(endDate) : undefined;

    return this.dashboardService.getTeacherSalaryBreakdown(
      periodStart,
      periodEnd,
    );
  }
}
