import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './deck.entity';
import { DecksResolver } from './decks.resolver';
import { DecksService } from './decks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deck])],
  providers: [DecksResolver, DecksService],
  exports: [TypeOrmModule.forFeature([Deck]), DecksService],
})
export class DecksModule {}
