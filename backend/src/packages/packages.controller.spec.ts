import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { NotFoundException } from '@nestjs/common';

describe('PackagesController', () => {
  let controller: PackagesController;
  let service: PackagesService;

  const mockPackagesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    calculateProfit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [
        {
          provide: PackagesService,
          useValue: mockPackagesService,
        },
      ],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
    service = module.get<PackagesService>(PackagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new package', async () => {
      const createPackageDto: CreatePackageDto = {
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100, teacher: 500 },
      };

      const mockPackage = {
        _id: 'package1',
        ...createPackageDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPackagesService.create.mockResolvedValue(mockPackage);

      const result = await controller.create(createPackageDto);

      expect(result).toEqual(mockPackage);
      expect(service.create).toHaveBeenCalledWith(createPackageDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of packages', async () => {
      const mockPackages = [
        {
          _id: 'package1',
          packageName: 'Premium Package',
          price: 1000,
          expenses: { infrastructure: 100 },
        },
        {
          _id: 'package2',
          packageName: 'Basic Package',
          price: 500,
          expenses: { infrastructure: 50 },
        },
      ];

      mockPackagesService.findAll.mockResolvedValue(mockPackages);

      const result = await controller.findAll();

      expect(result).toEqual(mockPackages);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a package by id', async () => {
      const id = 'package1';
      const mockPackage = {
        _id: id,
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100 },
      };

      mockPackagesService.findOne.mockResolvedValue(mockPackage);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockPackage);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should return null when package not found', async () => {
      const id = 'nonexistent';
      mockPackagesService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(id);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a package', async () => {
      const id = 'package1';
      const updatePackageDto: CreatePackageDto = {
        packageName: 'Updated Package',
        price: 1200,
        expenses: { infrastructure: 150 },
      };

      const mockUpdatedPackage = {
        _id: id,
        ...updatePackageDto,
        updatedAt: new Date(),
      };

      mockPackagesService.update.mockResolvedValue(mockUpdatedPackage);

      const result = await controller.update(id, updatePackageDto);

      expect(result).toEqual(mockUpdatedPackage);
      expect(service.update).toHaveBeenCalledWith(id, updatePackageDto);
    });
  });

  describe('remove', () => {
    it('should delete a package', async () => {
      const id = 'package1';
      mockPackagesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toEqual({
        message: 'Package successfully deleted',
        statusCode: 200,
      });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('calculateProfit', () => {
    it('should calculate profit for a package', async () => {
      const id = 'package1';
      const mockProfit = {
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100, teacher: 500 },
        totalExpenses: 600,
        profit: 400,
      };

      mockPackagesService.calculateProfit.mockResolvedValue(mockProfit);

      const result = await controller.calculateProfit(id);

      expect(result).toEqual(mockProfit);
      expect(service.calculateProfit).toHaveBeenCalledWith(id);
    });
  });
});

