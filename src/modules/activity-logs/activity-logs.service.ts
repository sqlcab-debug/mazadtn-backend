import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogsRepository: Repository<ActivityLog>,
  ) {}

  async findAll(): Promise<ActivityLog[]> {
    return this.activityLogsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 200,
    });
  }

  async create(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const entity = new ActivityLog();
    entity.action = data.action || null as any;
    entity.entity = data.entity || null as any;
    entity.entityId = (data.entityId || (data as any).entity_id || null) as any;
    entity.userEmail = (data.userEmail || (data as any).user_email || null) as any;
    entity.userName = (data.userName || (data as any).user_name || null) as any;
    entity.details = data.details || null as any;
    entity.metadata = data.metadata || null;

    return this.activityLogsRepository.save(entity);
  }
}
