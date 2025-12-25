import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionsService } from './sessions.service';
import { Session } from './sessions.entity';
import { TeachersService } from '../teachers/teachers.service';
import { PackagesService } from '../packages/packages.service';
import { CreateSessionDto } from './dto/request/create-session.dto';
import { NotFoundException } from '@nestjs/common';

describe('SessionsService', () => {
  let service: SessionsService;
  let sessionModel: Model<Session>;
  let teachersService: TeachersService;
  let packagesService: PackagesService;

  const mockSessionModel: any = jest.fn();

  const buildSessionDocument = (dto: any) => {
    const sessionDoc = {
      _id: 'session1',
      isConfirmed: dto.isConfirmed ?? false,
      ...dto,
    };

    sessionDoc.toObject = jest.fn().mockReturnValue({
      _id: sessionDoc._id,
      teacherId: sessionDoc.teacherId,
      packageId: sessionDoc.packageId,
      sessionDate: sessionDoc.sessionDate,
      duration: sessionDoc.duration,
      isConfirmed: sessionDoc.isConfirmed,
      title: sessionDoc.title,
      notes: sessionDoc.notes,
    });

    sessionDoc.save = jest.fn().mockResolvedValue(sessionDoc);
    return sessionDoc;
  };

  mockSessionModel.find = jest.fn();
  mockSessionModel.findById = jest.fn();
  mockSessionModel.findByIdAndUpdate = jest.fn();
  mockSessionModel.deleteOne = jest.fn();

  const mockTeachersService = {
    findOne: jest.fn(),
  };

  const mockPackagesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    mockSessionModel.mockImplementation((dto) => buildSessionDocument(dto));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken(Session.name),
          useValue: mockSessionModel,
        },
        {
          provide: TeachersService,
          useValue: mockTeachersService,
        },
        {
          provide: PackagesService,
          useValue: mockPackagesService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    sessionModel = module.get<Model<Session>>(getModelToken(Session.name));
    teachersService = module.get<TeachersService>(TeachersService);
    packagesService = module.get<PackagesService>(PackagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session and enrich with related data', async () => {
      const createSessionDto: CreateSessionDto = {
        teacherId: 'teacher1',
        packageId: 'package1',
        sessionDate: '2024-01-15T10:00:00Z',
        duration: 2,
      };

      const mockTeacher = {
        _id: 'teacher1',
        name: 'John Doe',
        hourlyRate: 50,
      };

      const mockPackage = {
        _id: 'package1',
        packageName: 'Premium Package',
        price: 1000,
      };

      // mockSessionModel is now a constructor function
      mockTeachersService.findOne.mockResolvedValue(mockTeacher);
      mockPackagesService.findOne.mockResolvedValue(mockPackage);

      const result = await service.create(createSessionDto);

      expect(mockSessionModel).toHaveBeenCalledWith(createSessionDto);
      const sessionInstance = mockSessionModel.mock.results[0]?.value;
      expect(sessionInstance.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(mockTeachersService.findOne).toHaveBeenCalledWith('teacher1');
      expect(mockPackagesService.findOne).toHaveBeenCalledWith('package1');
      expect(result.teacher).toEqual(mockTeacher);
      expect(result.package).toEqual(mockPackage);
      expect(result.teacherId).toBe('teacher1');
      expect(result.packageId).toBe('package1');
    });
  });

  describe('findAll', () => {
    it('should return all sessions with enriched data', async () => {
      const mockSessions = [
        {
          _id: 'session1',
          teacherId: { toString: () => 'teacher1' },
          packageId: { toString: () => 'package1' },
          sessionDate: new Date(),
          duration: 2,
          toObject: jest.fn().mockReturnValue({
            _id: 'session1',
            teacherId: 'teacher1',
            packageId: 'package1',
            sessionDate: new Date(),
            duration: 2,
          }),
        },
      ];

      mockSessionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSessions),
      });

      mockTeachersService.findOne.mockResolvedValue({
        _id: 'teacher1',
        name: 'John Doe',
      });

      mockPackagesService.findOne.mockResolvedValue({
        _id: 'package1',
        packageName: 'Premium Package',
      });

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findByTeacher', () => {
    it('should return sessions for a specific teacher', async () => {
      const teacherId = 'teacher1';
      const mockSessions = [
        {
          _id: 'session1',
          teacherId: { toString: () => teacherId },
          packageId: { toString: () => 'package1' },
          toObject: jest.fn().mockReturnValue({
            _id: 'session1',
            teacherId,
            packageId: 'package1',
          }),
        },
      ];

      mockSessionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSessions),
      });

      mockTeachersService.findOne.mockResolvedValue({
        _id: teacherId,
        name: 'John Doe',
      });

      mockPackagesService.findOne.mockResolvedValue({
        _id: 'package1',
        packageName: 'Premium Package',
      });

      const result = await service.findByTeacher(teacherId);

      expect(result).toBeDefined();
      expect(mockSessionModel.find).toHaveBeenCalledWith({ teacherId });
    });
  });

  describe('findByPackage', () => {
    it('should return sessions for a specific package', async () => {
      const packageId = 'package1';
      const mockSessions = [
        {
          _id: 'session1',
          teacherId: { toString: () => 'teacher1' },
          packageId: { toString: () => packageId },
          toObject: jest.fn().mockReturnValue({
            _id: 'session1',
            teacherId: 'teacher1',
            packageId,
          }),
        },
      ];

      mockSessionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSessions),
      });

      const result = await service.findByPackage(packageId);

      expect(result).toBeDefined();
      expect(mockSessionModel.find).toHaveBeenCalledWith({ packageId });
    });
  });

  describe('findByDateRange', () => {
    it('should return sessions within date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const mockSessions = [
        {
          _id: 'session1',
          sessionDate: new Date('2024-01-15'),
          teacherId: { toString: () => 'teacher1' },
          packageId: { toString: () => 'package1' },
          toObject: jest.fn().mockReturnValue({
            _id: 'session1',
            sessionDate: new Date('2024-01-15'),
          }),
        },
      ];

      mockSessionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSessions),
      });

      const result = await service.findByDateRange(startDate, endDate);

      expect(result).toBeDefined();
      expect(mockSessionModel.find).toHaveBeenCalledWith({
        sessionDate: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    });
  });

  describe('findConfirmed', () => {
    it('should return confirmed sessions', async () => {
      const mockSessions = [
        {
          _id: 'session1',
          isConfirmed: true,
          teacherId: { toString: () => 'teacher1' },
          packageId: { toString: () => 'package1' },
          toObject: jest.fn().mockReturnValue({
            _id: 'session1',
            isConfirmed: true,
          }),
        },
      ];

      mockSessionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSessions),
      });

      const result = await service.findConfirmed();

      expect(result).toBeDefined();
      expect(mockSessionModel.find).toHaveBeenCalledWith({ isConfirmed: true });
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        teacherId: { toString: () => 'teacher1' },
        packageId: { toString: () => 'package1' },
        toObject: jest.fn().mockReturnValue({
          _id: id,
        }),
      };

      mockSessionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSession),
      });

      const result = await service.findOne(id);

      expect(result).toBeDefined();
      expect(mockSessionModel.findById).toHaveBeenCalledWith(id);
    });

    it('should return null when session not found', async () => {
      const id = 'nonexistent';
      mockSessionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const id = 'session1';
      const updateSessionDto: Partial<CreateSessionDto> = {
        duration: 3,
      };

      const mockUpdatedSession = {
        _id: id,
        ...updateSessionDto,
        teacherId: { toString: () => 'teacher1' },
        packageId: { toString: () => 'package1' },
        toObject: jest.fn().mockReturnValue({
          _id: id,
          ...updateSessionDto,
        }),
      };

      mockSessionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedSession),
      });

      const result = await service.update(id, updateSessionDto);

      expect(result).toBeDefined();
      expect(mockSessionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateSessionDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete a session', async () => {
      const id = 'session1';
      mockSessionModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(id);

      expect(mockSessionModel.deleteOne).toHaveBeenCalledWith({ _id: id });
    });

    it('should throw NotFoundException when session not found', async () => {
      const id = 'nonexistent';
      mockSessionModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirm', () => {
    it('should confirm a session', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        isConfirmed: true,
        teacherId: { toString: () => 'teacher1' },
        packageId: { toString: () => 'package1' },
        toObject: jest.fn().mockReturnValue({
          _id: id,
          isConfirmed: true,
        }),
      };

      mockSessionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSession),
      });

      const result = await service.confirm(id);

      expect(result).toBeDefined();
      expect(mockSessionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { isConfirmed: true },
        { new: true },
      );
    });
  });

  describe('unconfirm', () => {
    it('should unconfirm a session', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        isConfirmed: false,
        teacherId: { toString: () => 'teacher1' },
        packageId: { toString: () => 'package1' },
        toObject: jest.fn().mockReturnValue({
          _id: id,
          isConfirmed: false,
        }),
      };

      mockSessionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSession),
      });

      const result = await service.unconfirm(id);

      expect(result).toBeDefined();
      expect(mockSessionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { isConfirmed: false },
        { new: true },
      );
    });
  });
});
