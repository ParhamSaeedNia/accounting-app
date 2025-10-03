import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { Package } from './packages.entity';
import { PackageResponseDto } from './dto/response/package-response.dto';
import { CalculateProfitResponseDto } from './dto/response/calculate-profit-response.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
  ) {}

  async create(
    createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    const newPackage = new this.packageModel(createPackageDto);
    return (await newPackage.save()) as PackageResponseDto;
  }

  async findAll(): Promise<PackageResponseDto[]> {
    return (await this.packageModel.find().exec()) as PackageResponseDto[];
  }

  async findOne(id: string): Promise<PackageResponseDto | null> {
    return (await this.packageModel
      .findById(id)
      .exec()) as PackageResponseDto | null;
  }

  async update(
    id: string,
    updatePackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto | null> {
    return (await this.packageModel
      .findByIdAndUpdate(id, updatePackageDto, { new: true })
      .exec()) as PackageResponseDto | null;
  }

  async remove(id: string): Promise<void> {
    const result = await this.packageModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Package not found');
    }
  }

  async calculateProfit(id: string): Promise<CalculateProfitResponseDto> {
    const pkg = await this.findOne(id);
    if (!pkg) throw new NotFoundException('Package not found');
    const price = pkg.price;
    const expenses = pkg.expenses;
    const calculatedExpenses = {};
    let totalExpenses = 0;
    for (const [key, percent] of Object.entries(expenses)) {
      const amount = (percent / 100) * price;
      calculatedExpenses[key] = amount;
      totalExpenses += amount;
    }
    return {
      packageName: pkg.packageName,
      price,
      expenses: calculatedExpenses,
      totalExpenses,
      profit: price - totalExpenses,
    };
  }
}
