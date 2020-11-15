import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecksModule } from '../decks/decks.module';
import { Card } from './card.entity';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), DecksModule],
  providers: [CardsResolver, CardsService],
})
export class CardsModule {}
