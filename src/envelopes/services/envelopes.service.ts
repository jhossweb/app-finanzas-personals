import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnvelopeDto } from '@/envelopes/dto/create-envelope.dto';
import { UpdateEnvelopeDto } from '@/envelopes/dto/update-envelope.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvelopeEnity } from '../entities/envelope.entity';

@Injectable()
export class EnvelopesService {

  constructor(
    @InjectRepository(EnvelopeEnity)
    private readonly envelopeRepository: Repository<EnvelopeEnity>,
  ) {}

  async create(createEnvelopeDto: CreateEnvelopeDto) {
    
    try{
      return await this.envelopeRepository.save(createEnvelopeDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating envelope: ${error.message}`);
    }

  }

  async findEnvelopeByUserId(id: string): Promise<EnvelopeEnity | null >{
    try {
      const envelopes = await this.envelopeRepository.findOne({
        where: { user_id: id }
      });

      console.log(envelopes)

      return envelopes;

    } catch (error) { 
      throw new NotFoundException(`Envelope with User ID ${id} not found`);
    }
  }

  findAll() {
    return `This action returns all envelopes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} envelope`;
  }

  update(id: number, updateEnvelopeDto: UpdateEnvelopeDto) {
    return `This action updates a #${id} envelope`;
  }

  remove(id: number) {
    return `This action removes a #${id} envelope`;
  }
}
