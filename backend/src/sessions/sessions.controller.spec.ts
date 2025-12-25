import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/request/create-session.dto';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  const mockSessionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findConfirmed: jest.fn(),
    findByTeacher: jest.fn(),
    findByPackage: jest.fn(),
    findByDateRange: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    confirm: jest.fn(),
    unconfirm: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        teacherId: 'teacher1',
        packageId: 'package1',
        sessionDate: '2024-01-15T10:00:00Z',
        duration: 2,
        title: 'Math Session',
      };

      const mockSession = {
        _id: 'session1',
        ...createSessionDto,
        isConfirmed: false,
      };

      mockSessionsService.create.mockResolvedValue(mockSession);

      const result = await controller.create(createSessionDto);

      expect(result).toEqual(mockSession);
      expect(service.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sessions', async () => {
      const mockSessions = [
        {
          _id: 'session1',
          teacherId: 'teacher1',
          packageId: 'package1',
          duration: 2,
        },
        {
          _id: 'session2',
          teacherId: 'teacher2',
          packageId: 'package2',
          duration: 1.5,
        },
      ];

      mockSessionsService.findAll.mockResolvedValue(mockSessions);

      const result = await controller.findAll();

      expect(result).toEqual(mockSessions);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findConfirmed', () => {
    it('should return confirmed sessions', async () => {
      const mockSessions = [
        {
          _id: 'session1',
          isConfirmed: true,
        },
      ];

      mockSessionsService.findConfirmed.mockResolvedValue(mockSessions);

      const result = await controller.findConfirmed();

      expect(result).toEqual(mockSessions);
      expect(service.findConfirmed).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByTeacher', () => {
    it('should return sessions for a specific teacher', async () => {
      const teacherId = 'teacher1';
      const mockSessions = [
        {
          _id: 'session1',
          teacherId,
          packageId: 'package1',
        },
      ];

      mockSessionsService.findByTeacher.mockResolvedValue(mockSessions);

      const result = await controller.findByTeacher(teacherId);

      expect(result).toEqual(mockSessions);
      expect(service.findByTeacher).toHaveBeenCalledWith(teacherId);
    });
  });

  describe('findByPackage', () => {
    it('should return sessions for a specific package', async () => {
      const packageId = 'package1';
      const mockSessions = [
        {
          _id: 'session1',
          teacherId: 'teacher1',
          packageId,
        },
      ];

      mockSessionsService.findByPackage.mockResolvedValue(mockSessions);

      const result = await controller.findByPackage(packageId);

      expect(result).toEqual(mockSessions);
      expect(service.findByPackage).toHaveBeenCalledWith(packageId);
    });
  });

  describe('findByDateRange', () => {
    it('should return sessions within date range', async () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-01-31T23:59:59Z';
      const mockSessions = [
        {
          _id: 'session1',
          sessionDate: new Date('2024-01-15'),
        },
      ];

      mockSessionsService.findByDateRange.mockResolvedValue(mockSessions);

      const result = await controller.findByDateRange(startDate, endDate);

      expect(result).toEqual(mockSessions);
      expect(service.findByDateRange).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        teacherId: 'teacher1',
        packageId: 'package1',
      };

      mockSessionsService.findOne.mockResolvedValue(mockSession);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockSession);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const id = 'session1';
      const updateSessionDto: CreateSessionDto = {
        teacherId: 'teacher1',
        packageId: 'package1',
        sessionDate: '2024-01-15T10:00:00Z',
        duration: 3,
      };

      const mockUpdatedSession = {
        _id: id,
        ...updateSessionDto,
      };

      mockSessionsService.update.mockResolvedValue(mockUpdatedSession);

      const result = await controller.update(id, updateSessionDto);

      expect(result).toEqual(mockUpdatedSession);
      expect(service.update).toHaveBeenCalledWith(id, updateSessionDto);
    });
  });

  describe('confirm', () => {
    it('should confirm a session', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        isConfirmed: true,
      };

      mockSessionsService.confirm.mockResolvedValue(mockSession);

      const result = await controller.confirm(id);

      expect(result).toEqual(mockSession);
      expect(service.confirm).toHaveBeenCalledWith(id);
    });
  });

  describe('unconfirm', () => {
    it('should unconfirm a session', async () => {
      const id = 'session1';
      const mockSession = {
        _id: id,
        isConfirmed: false,
      };

      mockSessionsService.unconfirm.mockResolvedValue(mockSession);

      const result = await controller.unconfirm(id);

      expect(result).toEqual(mockSession);
      expect(service.unconfirm).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should delete a session', async () => {
      const id = 'session1';
      mockSessionsService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

