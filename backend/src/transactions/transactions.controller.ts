import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { TransactionFilterDto } from './dto/request/transaction-filter.dto';
import { TransactionResponseDto } from './dto/response/transaction-response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  //---------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created',
    type: TransactionResponseDto,
  })
  @ApiBody({ type: CreateTransactionDto })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }
  //---------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @ApiOkResponse({
    description: 'List of transactions',
    type: [TransactionResponseDto],
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date filter',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date filter',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filter by month (YYYY-MM)',
  })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or notes',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc/desc)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  async findAll(
    @Query() filters: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findWithFilters(filters);
  }
  //---------------------------------------------
  @Get('summary')
  @ApiOperation({ summary: 'Get transaction summary with filters' })
  @ApiOkResponse({
    description: 'Transaction summary',
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date filter',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date filter',
  })
  async getSummary(@Query() filters: TransactionFilterDto) {
    return this.transactionsService.getSummary(filters);
  }
  //---------------------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiOkResponse({
    description: 'The transaction details',
    type: TransactionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  findOne(@Param('id') id: string): Promise<TransactionResponseDto | null> {
    return this.transactionsService.findOne(id);
  }
  //---------------------------------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiOkResponse({
    description: 'The updated transaction',
    type: TransactionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiBody({ type: CreateTransactionDto })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto | null> {
    return this.transactionsService.update(id, updateTransactionDto);
  }
  //---------------------------------------------
  @Patch(':id/exclude')
  @ApiOperation({ summary: 'Exclude a transaction from calculations' })
  @ApiOkResponse({
    description: 'Transaction excluded successfully',
    type: TransactionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  exclude(@Param('id') id: string): Promise<TransactionResponseDto | null> {
    return this.transactionsService.exclude(id);
  }
  //---------------------------------------------
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a transaction' })
  @ApiOkResponse({
    description: 'Transaction activated successfully',
    type: TransactionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  activate(@Param('id') id: string): Promise<TransactionResponseDto | null> {
    return this.transactionsService.activate(id);
  }
  //---------------------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiOkResponse({
    description: 'Transaction successfully deleted',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }
}
