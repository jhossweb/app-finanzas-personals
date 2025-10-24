import { Module } from '@nestjs/common';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';
import { EnvelopesController } from '@/envelopes/controllers/envelopes.controller';

@Module({
  controllers: [EnvelopesController],
  providers: [EnvelopesService],
})
export class EnvelopesModule {}
