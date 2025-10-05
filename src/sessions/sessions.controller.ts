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
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/request/create-session.dto';
import { SessionResponseDto } from './dto/response/session-response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiCreatedResponse({
    description: 'The session has been successfully created',
    type: SessionResponseDto,
  })
  @ApiBody({ type: CreateSessionDto })
  create(
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  @ApiOkResponse({
    description: 'List of all sessions',
    type: [SessionResponseDto],
  })
  findAll(): Promise<SessionResponseDto[]> {
    return this.sessionsService.findAll();
  }

  @Get('confirmed')
  @ApiOperation({ summary: 'Get all confirmed sessions' })
  @ApiOkResponse({
    description: 'List of confirmed sessions',
    type: [SessionResponseDto],
  })
  findConfirmed(): Promise<SessionResponseDto[]> {
    return this.sessionsService.findConfirmed();
  }

  @Get('by-teacher/:teacherId')
  @ApiOperation({ summary: 'Get sessions by teacher' })
  @ApiOkResponse({
    description: 'List of sessions for a specific teacher',
    type: [SessionResponseDto],
  })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  findByTeacher(
    @Param('teacherId') teacherId: string,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.findByTeacher(teacherId);
  }

  @Get('by-package/:packageId')
  @ApiOperation({ summary: 'Get sessions by package' })
  @ApiOkResponse({
    description: 'List of sessions for a specific package',
    type: [SessionResponseDto],
  })
  @ApiParam({ name: 'packageId', description: 'Package ID' })
  findByPackage(
    @Param('packageId') packageId: string,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.findByPackage(packageId);
  }

  @Get('by-date-range')
  @ApiOperation({ summary: 'Get sessions by date range' })
  @ApiOkResponse({
    description: 'List of sessions within date range',
    type: [SessionResponseDto],
  })
  @ApiQuery({ name: 'startDate', description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', description: 'End date (ISO string)' })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiOkResponse({
    description: 'The session details',
    type: SessionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Session ID' })
  findOne(@Param('id') id: string): Promise<SessionResponseDto | null> {
    return this.sessionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a session' })
  @ApiOkResponse({
    description: 'The updated session',
    type: SessionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiBody({ type: CreateSessionDto })
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto | null> {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a session' })
  @ApiOkResponse({
    description: 'Session confirmed successfully',
    type: SessionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Session ID' })
  confirm(@Param('id') id: string): Promise<SessionResponseDto | null> {
    return this.sessionsService.confirm(id);
  }

  @Patch(':id/unconfirm')
  @ApiOperation({ summary: 'Unconfirm a session' })
  @ApiOkResponse({
    description: 'Session unconfirmed successfully',
    type: SessionResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Session ID' })
  unconfirm(@Param('id') id: string): Promise<SessionResponseDto | null> {
    return this.sessionsService.unconfirm(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  @ApiOkResponse({
    description: 'Session successfully deleted',
  })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.sessionsService.remove(id);
  }
}
