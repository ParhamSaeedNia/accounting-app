import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PackagesService } from './packages.service';
import { Package } from './packages.entity';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { NotFoundException } from '@nestjs/common';

describe('PackagesService', () => {
  let service: PackagesService;

  const mockPackageModel = Object.assign(
    jest.fn().mockImplementation((dto: CreatePackageDto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    })),
    {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: getModelToken(Package.name),
          useValue: mockPackageModel,
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new package', async () => {
      const createPackageDto: CreatePackageDto = {
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100, teacher: 500 },
      };

      const result = await service.create(createPackageDto);
      expect(result).toEqual(createPackageDto);

      const createdPackageInstance = mockPackageModel.mock.results[0]
        ?.value as { save: jest.Mock };
      expect(createdPackageInstance.save).toHaveBeenCalled();
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

      mockPackageModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackages),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockPackages);
      expect(mockPackageModel.find).toHaveBeenCalled();
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

      mockPackageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackage),
      });

      const result = await service.findOne(id);

      expect(result).toEqual(mockPackage);
      expect(mockPackageModel.findById).toHaveBeenCalledWith(id);
    });

    it('should return null when package not found', async () => {
      const id = 'nonexistent';
      mockPackageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne(id);

      expect(result).toBeNull();
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
      };

      mockPackageModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedPackage),
      });

      const result = await service.update(id, updatePackageDto);

      expect(result).toEqual(mockUpdatedPackage);
      expect(mockPackageModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updatePackageDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete a package', async () => {
      const id = 'package1';
      mockPackageModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(id);

      expect(mockPackageModel.deleteOne).toHaveBeenCalledWith({ _id: id });
    });

    it('should throw NotFoundException when package not found', async () => {
      const id = 'nonexistent';
      mockPackageModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Package not found');
    });
  });

  describe('calculateProfit', () => {
    it('should calculate profit correctly', async () => {
      const id = 'package1';
      const mockPackage = {
        _id: id,
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100, teacher: 500, marketing: 200 },
      };

      mockPackageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPackage),
      });

      const result = await service.calculateProfit(id);

      expect(result).toEqual({
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100, teacher: 500, marketing: 200 },
        totalExpenses: 800,
        profit: 200,
      });
    });

    it('should throw NotFoundException when package not found', async () => {
      const id = 'nonexistent';
      mockPackageModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.calculateProfit(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
