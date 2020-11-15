import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './deck.entity';

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private deckRepository: Repository<Deck>
  ) {}

  async findAll(userId: string) {
    return this.deckRepository.find({ userId });
  }

  async findById(deckId: string) {
    return this.deckRepository.findOne({ id: deckId });
  }

  async create(userId: string, name: string) {
    const newDeck = this.deckRepository.create({
      name,
      userId,
    });
    const result = await this.deckRepository.save(newDeck);
    return { id: result.id, name: result.name };
  }

  async update(deckId: string, name: string) {
    await this.deckRepository
      .createQueryBuilder()
      .update(Deck)
      .set({ name })
      .where('id = :id', { id: deckId })
      .execute();
    return { id: deckId, name };
  }

  async delete(deckId: string) {
    await this.deckRepository.delete(deckId);
    return deckId;
  }
}
