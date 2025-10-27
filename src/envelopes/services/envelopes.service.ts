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

  /** sumar monto en el sobere al crear la transaccion */
  async addAmountToEnvelope(envelopeId: string, amount: number) {
    console.log(`servicio de sobre: ${envelopeId}`)
  
    const envelope = await this.envelopeRepository.findOne({ where: { id: envelopeId } });
    if (!envelope) throw new NotFoundException(`Envelope with ID ${envelopeId} not found`);

    try {
      envelope.envelope_amount = Number(envelope.envelope_amount) + Number(amount);

      console.log(`Nuevo saldo del sobre: ${envelope.envelope_amount}`);
      return await this.envelopeRepository.save(envelope);
    } catch (error) {
      throw new InternalServerErrorException(`Error adding amount to envelope: ${error.message}`);
    }
  }

  /** restar monto en el sobere al crear la transaccion */
  async subtractAmountFromEnvelope(envelopeId: string, amount: number) {
    const envelope = await this.envelopeRepository.findOne({ where: { id: envelopeId } });
    if (!envelope) throw new NotFoundException(`Envelope with ID ${envelopeId} not found`);

    if (envelope.envelope_amount < amount || amount <= 0)  
        throw new BadRequestException({
          message: 'Saldo insuficiente o la cantidad es inválida',
          envelopeId
        });


    try {
      envelope.envelope_amount = Number(envelope.envelope_amount) - Number(amount);
      return await this.envelopeRepository.save(envelope);
    } catch (error) {
      throw new InternalServerErrorException(`Error subtracting amount from envelope: ${error.message}`);
    }
  }

  /** actualizar sobres al realizar una transferencia */
  async updateAmountEnvelopes(envelopeOriginId: string, envelopeDestinationId: string, amount: number) {
    
    try {
      
      await this.envelopeRepository.update(envelopeOriginId, { envelope_amount: () => `envelope_amount - ${amount}` });
      await this.envelopeRepository.update(envelopeDestinationId, { envelope_amount: () => `envelope_amount + ${amount}` });


    } catch (error) {
      throw new InternalServerErrorException(`Error updating envelopes: ${error.message}`);
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
