import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/request/create-teacher.dto';
import { TeacherResponseDto } from './dto/response/teacher-response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  //---------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiCreatedResponse({
    description: 'The teacher has been successfully created',
    type: TeacherResponseDto,
  })
  @ApiBody({ type: CreateTeacherDto })
  create(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.create(createTeacherDto);
  }
  //---------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiOkResponse({
    description: 'List of all teachers',
    type: [TeacherResponseDto],
  })
  findAll(): Promise<TeacherResponseDto[]> {
    return this.teachersService.findAll();
  }
  //---------------------------------------------
  @Get('active')
  @ApiOperation({ summary: 'Get all active teachers' })
  @ApiOkResponse({
    description: 'List of active teachers',
    type: [TeacherResponseDto],
  })
  findActive(): Promise<TeacherResponseDto[]> {
    return this.teachersService.findActive();
  }
  //---------------------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiOkResponse({
    description: 'The teacher details',
    type: TeacherResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  findOne(@Param('id') id: string): Promise<TeacherResponseDto | null> {
    return this.teachersService.findOne(id);
  }
  //---------------------------------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiOkResponse({
    description: 'The updated teacher',
    type: TeacherResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiBody({ type: CreateTeacherDto })
  update(
    @Param('id') id: string,
    @Body() updateTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto | null> {
    return this.teachersService.update(id, updateTeacherDto);
  }
  //---------------------------------------------
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a teacher' })
  @ApiOkResponse({
    description: 'Teacher activated successfully',
    type: TeacherResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  activate(@Param('id') id: string): Promise<TeacherResponseDto | null> {
    return this.teachersService.activate(id);
  }
  //---------------------------------------------
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a teacher' })
  @ApiOkResponse({
    description: 'Teacher deactivated successfully',
    type: TeacherResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  deactivate(@Param('id') id: string): Promise<TeacherResponseDto | null> {
    return this.teachersService.deactivate(id);
  }
  //---------------------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiOkResponse({
    description: 'Teacher successfully deleted',
  })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.teachersService.remove(id);
  }
}
