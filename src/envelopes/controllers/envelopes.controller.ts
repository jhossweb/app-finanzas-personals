import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';
import { CreateEnvelopeDto } from '@/envelopes/dto/create-envelope.dto';
import { UpdateEnvelopeDto } from '@/envelopes/dto/update-envelope.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('envelopes')
@UseGuards(AuthGuard('jwt-cookie')) // Ensure that all routes are protected by JWT authentication 
export class EnvelopesController {
  constructor(private readonly envelopesService: EnvelopesService) {}

  @Post()
  create(@Body() createEnvelopeDto: CreateEnvelopeDto) {
    //return this.envelopesService.create(createEnvelopeDto);
  }

  @Get()
  findAll() {
    return this.envelopesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  
    return this.envelopesService.findEnvelopeByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnvelopeDto: UpdateEnvelopeDto) {
    return this.envelopesService.update(+id, updateEnvelopeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.envelopesService.remove(+id);
  }
}
