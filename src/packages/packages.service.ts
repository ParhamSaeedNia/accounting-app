import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from './packages.entity';
import { promises as fs } from 'fs';
import * as path from 'path';

const DB_PATH = path.resolve(__dirname, '../../db.json');

async function readDb(): Promise<Package[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDb(packages: Package[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(packages, null, 2), 'utf-8');
}

@Injectable()
export class PackagesService {
  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const packages = await readDb();
    const newPackage: Package = {
      ...createPackageDto,
      _id: (Math.random() + Date.now()).toString(36),
    } as Package;
    packages.push(newPackage);
    await writeDb(packages);
    return newPackage;
  }

  async findAll(): Promise<Package[]> {
    return readDb();
  }

  async findOne(id: string): Promise<Package | null> {
    const packages = await readDb();
    return packages.find((pkg) => pkg._id === id) || null;
  }

  async update(
    id: string,
    updatePackageDto: CreatePackageDto,
  ): Promise<Package | null> {
    const packages = await readDb();
    const idx = packages.findIndex((pkg) => pkg._id === id);
    if (idx === -1) return null;
    packages[idx] = { ...packages[idx], ...updatePackageDto };
    await writeDb(packages);
    return packages[idx];
  }

  async remove(id: string): Promise<void> {
    const packages = await readDb();
    const idx = packages.findIndex((pkg) => pkg._id === id);
    if (idx === -1) throw new NotFoundException('Package not found');
    packages.splice(idx, 1);
    await writeDb(packages);
  }

  async calculateProfit(id: string): Promise<any> {
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
