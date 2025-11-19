import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeachersService } from './teachers.service';
import { Teacher } from './teachers.entity';
import { CreateTeacherDto } from './dto/request/create-teacher.dto';
import { NotFoundException } from '@nestjs/common';

describe('TeachersService', () => {
  let service: TeachersService;
  let teacherModel: Model<Teacher>;

  const mockTeacherModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(dto),
  }));

  mockTeacherModel.find = jest.fn();
  mockTeacherModel.findById = jest.fn();
  mockTeacherModel.findByIdAndUpdate = jest.fn();
  mockTeacherModel.deleteOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: getModelToken(Teacher.name),
          useValue: mockTeacherModel,
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
    teacherModel = module.get<Model<Teacher>>(getModelToken(Teacher.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new teacher', async () => {
      const createTeacherDto: CreateTeacherDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        hourlyRate: 50,
        isActive: true,
      };

      // mockTeacherModel is now a constructor function

      const result = await service.create(createTeacherDto);

      expect(result).toEqual(createTeacherDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of teachers', async () => {
      const mockTeachers = [
        {
          _id: 'teacher1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          hourlyRate: 50,
        },
        {
          _id: 'teacher2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          hourlyRate: 60,
        },
      ];

      mockTeacherModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTeachers),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockTeachers);
      expect(mockTeacherModel.find).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return only active teachers', async () => {
      const mockTeachers = [
        {
          _id: 'teacher1',
          name: 'John Doe',
          isActive: true,
        },
      ];

      mockTeacherModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTeachers),
      });

      const result = await service.findActive();

      expect(result).toEqual(mockTeachers);
      expect(mockTeacherModel.find).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('findOne', () => {
    it('should return a teacher by id', async () => {
      const id = 'teacher1';
      const mockTeacher = {
        _id: id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        hourlyRate: 50,
      };

      mockTeacherModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTeacher),
      });

      const result = await service.findOne(id);

      expect(result).toEqual(mockTeacher);
      expect(mockTeacherModel.findById).toHaveBeenCalledWith(id);
    });

    it('should return null when teacher not found', async () => {
      const id = 'nonexistent';
      mockTeacherModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const id = 'teacher1';
      const updateTeacherDto: Partial<CreateTeacherDto> = {
        hourlyRate: 55,
      };

      const mockUpdatedTeacher = {
        _id: id,
        name: 'John Doe',
        hourlyRate: 55,
      };

      mockTeacherModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedTeacher),
      });

      const result = await service.update(id, updateTeacherDto);

      expect(result).toEqual(mockUpdatedTeacher);
      expect(mockTeacherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateTeacherDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete a teacher', async () => {
      const id = 'teacher1';
      mockTeacherModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(id);

      expect(mockTeacherModel.deleteOne).toHaveBeenCalledWith({ _id: id });
    });

    it('should throw NotFoundException when teacher not found', async () => {
      const id = 'nonexistent';
      mockTeacherModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Teacher not found');
    });
  });

  describe('deactivate', () => {
    it('should deactivate a teacher', async () => {
      const id = 'teacher1';
      const mockTeacher = {
        _id: id,
        name: 'John Doe',
        isActive: false,
      };

      mockTeacherModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTeacher),
      });

      const result = await service.deactivate(id);

      expect(result).toEqual(mockTeacher);
      expect(mockTeacherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { isActive: false },
        { new: true },
      );
    });
  });

  describe('activate', () => {
    it('should activate a teacher', async () => {
      const id = 'teacher1';
      const mockTeacher = {
        _id: id,
        name: 'John Doe',
        isActive: true,
      };

      mockTeacherModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTeacher),
      });

      const result = await service.activate(id);

      expect(result).toEqual(mockTeacher);
      expect(mockTeacherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { isActive: true },
        { new: true },
      );
    });
  });
});

