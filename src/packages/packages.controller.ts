import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { PackageResponseDto } from './dto/response/package-response.dto';
import { CalculateProfitResponseDto } from './dto/response/calculate-profit-response.dto';
import { DeleteResponseDto } from './dto/response/delete-response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new package' })
  @ApiCreatedResponse({
    description: 'The package has been successfully created',
    type: PackageResponseDto,
  })
  @ApiBody({ type: CreatePackageDto })
  create(
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages' })
  @ApiOkResponse({
    description: 'List of all packages',
    type: [PackageResponseDto],
  })
  findAll(): Promise<PackageResponseDto[]> {
    return this.packagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  @ApiOkResponse({
    description: 'The package details',
    type: PackageResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Package ID' })
  findOne(@Param('id') id: string): Promise<PackageResponseDto | null> {
    return this.packagesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a package' })
  @ApiOkResponse({
    description: 'The updated package',
    type: PackageResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiBody({ type: CreatePackageDto })
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto | null> {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package' })
  @ApiOkResponse({
    description: 'Package successfully deleted',
    type: DeleteResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Package ID' })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    await this.packagesService.remove(id);
    return {
      message: 'Package successfully deleted',
      statusCode: 200,
    };
  }

  @Get(':id/calculate')
  @ApiOperation({ summary: 'Calculate profit for a package' })
  @ApiOkResponse({
    description: 'Calculation results',
    type: CalculateProfitResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Package ID' })
  calculateProfit(
    @Param('id') id: string,
  ): Promise<CalculateProfitResponseDto> {
    return this.packagesService.calculateProfit(id);
  }
}
