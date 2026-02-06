import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({ data });
  }

  async findAll(query: { 
    page?: number; 
    limit?: number; 
    status?: TaskStatus; 
    q?: string 
  }) {

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(Number(query.limit) || 10, 50));
    
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.TaskWhereInput = {
      ...(query.status && { status: query.status }),

      ...(query.q && { 
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } }
        ]
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({ 
        where, 
        skip, 
        take, 
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.task.count({ where }),
    ]);

    return { 
      items, 
      page, 
      limit: take, 
      total 
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ 
      where: { id } 
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    await this.findOne(id);
    
    return this.prisma.task.update({ 
      where: { id }, 
      data 
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    
    return this.prisma.task.delete({ 
      where: { id } 
    });
  }
}