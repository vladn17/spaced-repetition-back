import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateCardInput,
  DeleteCardInput,
  EditCardInput,
  GetCardsInput,
  ScheduleCardInput,
} from '../graphql';
import { AuthGuard } from '../guards/auth.guard';
import { CardOwnerGuard } from '../guards/cardOwner.guard';
import { DeckOwnerGuard } from '../guards/deckOwner.guard';
import { CardsService } from './cards.service';

@Resolver()
@UseGuards(AuthGuard)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  @UseGuards(DeckOwnerGuard)
  @Query()
  async getCards(@Args('input') input: GetCardsInput) {
    return this.cardsService.findAllByDeck(input.deckId);
  }

  @UseGuards(DeckOwnerGuard)
  @Mutation()
  async createCard(@Args('input') input: CreateCardInput) {
    return this.cardsService.create(input);
  }

  @UseGuards(CardOwnerGuard)
  @Mutation()
  async editCard(@Args('input') { id, question, answer }: EditCardInput) {
    return this.cardsService.edit(id, question, answer);
  }

  @UseGuards(CardOwnerGuard)
  @Mutation()
  async deleteCard(@Args('input') input: DeleteCardInput) {
    return this.cardsService.delete(input.id);
  }

  @UseGuards(CardOwnerGuard)
  @Mutation()
  async scheduleCard(@Args('input') input: ScheduleCardInput) {
    return this.cardsService.schedule(input);
  }
}
