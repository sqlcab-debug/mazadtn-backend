import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  async findAll() {
    return this.activityLogsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.activityLogsService.create(body);
  }
}