import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeacherDto } from './dto/request/create-teacher.dto';
import { Teacher } from './teachers.entity';
import { TeacherResponseDto } from './dto/response/teacher-response.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async create(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    const newTeacher = new this.teacherModel(createTeacherDto);
    return (await newTeacher.save()) as TeacherResponseDto;
  }

  async findAll(): Promise<TeacherResponseDto[]> {
    return (await this.teacherModel.find().exec()) as TeacherResponseDto[];
  }

  async findActive(): Promise<TeacherResponseDto[]> {
    return (await this.teacherModel
      .find({ isActive: true })
      .exec()) as TeacherResponseDto[];
  }

  async findOne(id: string): Promise<TeacherResponseDto | null> {
    return (await this.teacherModel
      .findById(id)
      .exec()) as TeacherResponseDto | null;
  }

  async update(
    id: string,
    updateTeacherDto: Partial<CreateTeacherDto>,
  ): Promise<TeacherResponseDto | null> {
    return (await this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .exec()) as TeacherResponseDto | null;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teacherModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Teacher not found');
    }
  }

  async deactivate(id: string): Promise<TeacherResponseDto | null> {
    return (await this.teacherModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec()) as TeacherResponseDto | null;
  }

  async activate(id: string): Promise<TeacherResponseDto | null> {
    return (await this.teacherModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .exec()) as TeacherResponseDto | null;
  }
}
