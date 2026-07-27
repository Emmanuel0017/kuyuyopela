import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: AgentStatus) {
    return this.prisma.agent.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  create(dto: CreateAgentDto) {
    // public application form — always starts PENDING by schema default
    return this.prisma.agent.create({ data: dto });
  }

  async setStatus(id: string, status: AgentStatus) {
    await this.findOne(id);
    return this.prisma.agent.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    // safe as a hard delete — nothing else in the schema references Agent
    return this.prisma.agent.delete({ where: { id } });
  }
}