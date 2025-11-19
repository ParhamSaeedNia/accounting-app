import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/request/create-teacher.dto';

describe('TeachersController', () => {
  let controller: TeachersController;
  let service: TeachersService;

  const mockTeachersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: TeachersService,
          useValue: mockTeachersService,
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    service = module.get<TeachersService>(TeachersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new teacher', async () => {
      const createTeacherDto: CreateTeacherDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        hourlyRate: 50,
        isActive: true,
      };

      const mockTeacher = {
        _id: 'teacher1',
        ...createTeacherDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTeachersService.create.mockResolvedValue(mockTeacher);

      const result = await controller.create(createTeacherDto);

      expect(result).toEqual(mockTeacher);
      expect(service.create).toHaveBeenCalledWith(createTeacherDto);
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

      mockTeachersService.findAll.mockResolvedValue(mockTeachers);

      const result = await controller.findAll();

      expect(result).toEqual(mockTeachers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findActive', () => {
    it('should return active teachers only', async () => {
      const mockTeachers = [
        {
          _id: 'teacher1',
          name: 'John Doe',
          isActive: true,
        },
      ];

      mockTeachersService.findActive.mockResolvedValue(mockTeachers);

      const result = await controller.findActive();

      expect(result).toEqual(mockTeachers);
      expect(service.findActive).toHaveBeenCalledTimes(1);
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

      mockTeachersService.findOne.mockResolvedValue(mockTeacher);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockTeacher);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const id = 'teacher1';
      const updateTeacherDto: CreateTeacherDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        hourlyRate: 55,
      };

      const mockUpdatedTeacher = {
        _id: id,
        ...updateTeacherDto,
        updatedAt: new Date(),
      };

      mockTeachersService.update.mockResolvedValue(mockUpdatedTeacher);

      const result = await controller.update(id, updateTeacherDto);

      expect(result).toEqual(mockUpdatedTeacher);
      expect(service.update).toHaveBeenCalledWith(id, updateTeacherDto);
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

      mockTeachersService.activate.mockResolvedValue(mockTeacher);

      const result = await controller.activate(id);

      expect(result).toEqual(mockTeacher);
      expect(service.activate).toHaveBeenCalledWith(id);
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

      mockTeachersService.deactivate.mockResolvedValue(mockTeacher);

      const result = await controller.deactivate(id);

      expect(result).toEqual(mockTeacher);
      expect(service.deactivate).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should delete a teacher', async () => {
      const id = 'teacher1';
      mockTeachersService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

