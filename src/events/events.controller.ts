import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

//https://chat.openai.com/share/32739944-e171-47d5-b237-5e9e8ffed85f `InjectRepositoryとModuleでのDIの違い
@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  //全てのDBアクセスの操作は非同期通信となるので,asyncが必要
  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      where: { id: 3 },
    });
  }

  @Get('/practice-more-than')
  async practiceMoreThan() {
    // SELECT * FROM event WHERE (event.id > 3
    // AND event.when > '2021-@2-12T13:00:00')
    // OR event.description LIKE '%meet%'
    return await this.repository.find({
      where: [
        { id: MoreThan(3), when: MoreThan('2021-02-12T13:00:00') },
        { description: Like('%meet%') },
      ],
      take: 2,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.repository.findOne(id);
  }

  @Post()
  // async create(@Body(ValidationPipe) input: CreateEventDto) { moduleでValidationPipeを設定しているのでここでは不要
  async create(@Body(ValidationPipe) input: CreateEventDto) {
    console.log(input);
    const event = {
      ...input,
      when: new Date(input.when),
    };
    return await this.repository.save(event);
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);

    const UpdatedEvent = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    return await this.repository.save(UpdatedEvent);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    return await this.repository
      .findOne(id)
      .then((event) => this.repository.remove(event));
  }
}
