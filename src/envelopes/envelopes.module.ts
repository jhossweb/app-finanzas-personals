import { Module } from '@nestjs/common';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';
import { EnvelopesController } from '@/envelopes/controllers/envelopes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvelopeEnity } from './entities/envelope.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([EnvelopeEnity]) ],
  controllers: [EnvelopesController],
  providers: [EnvelopesService],
  exports: [EnvelopesService],
})
export class EnvelopesModule {}
