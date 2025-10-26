import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';
import { CreateEnvelopeDto } from '@/envelopes/dto/create-envelope.dto';
import { UpdateEnvelopeDto } from '@/envelopes/dto/update-envelope.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from '@/users/entities/user.entity';


@Controller('envelopes')
@UseGuards(AuthGuard('jwt-cookie')) // Ensure that all routes are protected by JWT authentication 
export class EnvelopesController {
  constructor(private readonly envelopesService: EnvelopesService) {}

  @Post()
  create(
    @Body() createEnvelopeDto: CreateEnvelopeDto,
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    return this.envelopesService.createEnvelopeWithUser(createEnvelopeDto, user.id);
  }

  @Get()
  findByUser(@Req() req: Request) {
    const user = req.user as UserEntity;
    return this.envelopesService.findEnvelopeByUserId(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnvelopeDto: UpdateEnvelopeDto) {
    return this.envelopesService.update(id, updateEnvelopeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.envelopesService.remove(id);
  }
}
