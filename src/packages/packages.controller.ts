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
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from './packages.entity';
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
    type: Package,
  })
  @ApiBody({ type: CreatePackageDto })
  create(@Body() createPackageDto: CreatePackageDto): Promise<Package> {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages' })
  @ApiOkResponse({ description: 'List of all packages', type: [Package] })
  findAll(): Promise<Package[]> {
    return this.packagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  @ApiOkResponse({ description: 'The package details', type: Package })
  @ApiParam({ name: 'id', description: 'Package ID' })
  findOne(@Param('id') id: string): Promise<Package | null> {
    return this.packagesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a package' })
  @ApiOkResponse({ description: 'The updated package', type: Package })
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiBody({ type: CreatePackageDto })
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: CreatePackageDto,
  ): Promise<Package | null> {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package' })
  @ApiOkResponse({ description: 'Package successfully deleted' })
  @ApiParam({ name: 'id', description: 'Package ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.packagesService.remove(id);
  }

  @Get(':id/calculate')
  @ApiOperation({ summary: 'Calculate profit for a package' })
  @ApiOkResponse({
    description: 'Calculation results',
    schema: {
      example: {
        packageName: 'test',
        price: 100,
        expenses: {
          infrastructure: 10,
          teacher: 50,
          x: 20,
        },
        totalExpenses: 80,
        profit: 20,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Package ID' })
  calculateProfit(@Param('id') id: string): Promise<any> {
    return this.packagesService.calculateProfit(id);
  }
}
