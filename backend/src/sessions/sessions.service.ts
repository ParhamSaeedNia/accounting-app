import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/request/create-session.dto';
import { Session } from './sessions.entity';
import { SessionResponseDto } from './dto/response/session-response.dto';
import { TeachersService } from '../teachers/teachers.service';
import { PackagesService } from '../packages/packages.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private teachersService: TeachersService,
    private packagesService: PackagesService,
  ) {}

  // Helper method to enrich session with teacher and package data
  private async enrichSessionWithRelatedData(
    session: Session,
  ): Promise<SessionResponseDto> {
    const teacher = await this.teachersService.findOne(
      session.teacherId.toString(),
    );
    const packageData = await this.packagesService.findOne(
      session.packageId.toString(),
    );

    return {
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
      teacher,
      package: packageData,
    } as SessionResponseDto;
  }

  //---------------------------------------------
  async create(
    createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    const newSession = new this.sessionModel(createSessionDto);
    const savedSession = await newSession.save();
    return this.enrichSessionWithRelatedData(savedSession);
  }
  //---------------------------------------------
  async findAll(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find().exec();
    return Promise.all(
      sessions.map((session) => this.enrichSessionWithRelatedData(session)),
    );
  }
  //---------------------------------------------
  async findByTeacher(teacherId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ teacherId }).exec();
    return Promise.all(
      sessions.map((session) => this.enrichSessionWithRelatedData(session)),
    );
  }
  //---------------------------------------------
  async findByPackage(packageId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ packageId }).exec();
    return Promise.all(
      sessions.map((session) => this.enrichSessionWithRelatedData(session)),
    );
  }
  //---------------------------------------------
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel
      .find({
        sessionDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();

    return Promise.all(
      sessions.map((session) => this.enrichSessionWithRelatedData(session)),
    );
  }
  //---------------------------------------------
  async findConfirmed(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ isConfirmed: true }).exec();
    return Promise.all(
      sessions.map((session) => this.enrichSessionWithRelatedData(session)),
    );
  }
  //---------------------------------------------
  async findOne(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) return null;
    return this.enrichSessionWithRelatedData(session);
  }
  //---------------------------------------------
  async update(
    id: string,
    updateSessionDto: Partial<CreateSessionDto>,
  ): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, updateSessionDto, { new: true })
      .exec();
    if (!session) return null;
    return this.enrichSessionWithRelatedData(session);
  }
  //---------------------------------------------
  async remove(id: string): Promise<void> {
    const result = await this.sessionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Session not found');
    }
  }
  //---------------------------------------------
  async confirm(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, { isConfirmed: true }, { new: true })
      .exec();
    if (!session) return null;
    return this.enrichSessionWithRelatedData(session);
  }
  //---------------------------------------------
  async unconfirm(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, { isConfirmed: false }, { new: true })
      .exec();
    if (!session) return null;
    return this.enrichSessionWithRelatedData(session);
  }
}
