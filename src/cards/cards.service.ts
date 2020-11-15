import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardInput, ScheduleCardInput } from '../graphql';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>
  ) {}

  async findAllByDeck(deckId: string) {
    return this.cardRepository.find({ deckId });
  }

  async findById(id: string) {
    return this.cardRepository.findOne({ id });
  }

  async create({ question, answer, date, deckId }: CreateCardInput) {
    const card = this.cardRepository.create({
      question,
      answer,
      date,
      repetition: 1,
      interval: '0',
      factor: 2.5,
      deckId,
    });
    const result = await this.cardRepository.save(card);
    return result;
  }

  async edit(id: string, question: string, answer: string) {
    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({ question, answer })
      .where('id = :id', { id })
      .execute();
    return { id, question, answer };
  }

  async delete(id: string) {
    await this.cardRepository.delete(id);
    return id;
  }

  async schedule(intervalData: ScheduleCardInput) {
    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set(intervalData)
      .where('id = :id', { id: intervalData.id })
      .execute();
    return intervalData;
  }
}
