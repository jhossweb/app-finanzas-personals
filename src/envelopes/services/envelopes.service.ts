import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnvelopeDto } from '@/envelopes/dto/create-envelope.dto';
import { UpdateEnvelopeDto } from '@/envelopes/dto/update-envelope.dto';
import { In, Repository, Equal, DeleteResult, UpdateResult } from 'typeorm';
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

  async createEnvelopeWithUser (dto: CreateEnvelopeDto, userId: string) {
    const userEnvelope = this.envelopeRepository.create({
      ...dto,
      envelope_amount: 0,
      user_id: { id: userId }
    })

    try {
        return await this.envelopeRepository.save(userEnvelope);
    } catch (error) {
        throw new Error(`Error creating envelope: ${error.message}`);
    }
  }

 

  async findEnvelopeByUserId(id: string): Promise<EnvelopeEnity | null >{
    try {
      const envelopes = await this.envelopeRepository.findOne({
        where: { user_id: Equal(id) }
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

  async update(id: string, updateEnvelopeDto: UpdateEnvelopeDto): Promise<UpdateResult | undefined> {
    
    try {
        const envelope: UpdateResult = await this.envelopeRepository.update(id, updateEnvelopeDto);

        if(envelope.affected === 0)
            throw new NotFoundException(`Envelope with ID ${id} not found`);

        return envelope;


    } catch (error) {
        throw new InternalServerErrorException(`Error updating envelope: ${error.message}`);
    }

  }

  async remove(id: string): Promise<DeleteResult | undefined> {
    
      try {
          
        const envelope: DeleteResult = await this.envelopeRepository.delete(id);
        
        if(envelope.affected === 0) 
          throw new NotFoundException(`Envelope with ID ${id} not found`);

        return envelope;

      } catch (error) {
        throw new InternalServerErrorException(`Error deleting envelope: ${error.message}`);
      }

  }
}
