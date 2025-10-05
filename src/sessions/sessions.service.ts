import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/request/create-session.dto';
import { Session } from './sessions.entity';
import { SessionResponseDto } from './dto/response/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async create(
    createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    const newSession = new this.sessionModel(createSessionDto);
    const savedSession = await newSession.save();
    return {
      ...savedSession.toObject(),
      teacherId: savedSession.teacherId.toString(),
      packageId: savedSession.packageId.toString(),
    } as SessionResponseDto;
  }

  async findAll(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find().exec();
    return sessions.map((session) => ({
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    })) as SessionResponseDto[];
  }

  async findByTeacher(teacherId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ teacherId }).exec();
    return sessions.map((session) => ({
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    })) as SessionResponseDto[];
  }

  async findByPackage(packageId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ packageId }).exec();
    return sessions.map((session) => ({
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    })) as SessionResponseDto[];
  }

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

    return sessions.map((session) => ({
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    })) as SessionResponseDto[];
  }

  async findConfirmed(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionModel.find({ isConfirmed: true }).exec();
    return sessions.map((session) => ({
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    })) as SessionResponseDto[];
  }

  async findOne(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) return null;
    return {
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    } as SessionResponseDto;
  }

  async update(
    id: string,
    updateSessionDto: Partial<CreateSessionDto>,
  ): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, updateSessionDto, { new: true })
      .exec();
    if (!session) return null;
    return {
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    } as SessionResponseDto;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sessionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Session not found');
    }
  }

  async confirm(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, { isConfirmed: true }, { new: true })
      .exec();
    if (!session) return null;
    return {
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    } as SessionResponseDto;
  }

  async unconfirm(id: string): Promise<SessionResponseDto | null> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, { isConfirmed: false }, { new: true })
      .exec();
    if (!session) return null;
    return {
      ...session.toObject(),
      teacherId: session.teacherId.toString(),
      packageId: session.packageId.toString(),
    } as SessionResponseDto;
  }
}
