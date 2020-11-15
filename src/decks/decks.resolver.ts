import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../currentUser.decorator';
import { DecksService } from './decks.service';
import { DeckOwnerGuard } from '../guards/deckOwner.guard';
import { CreateDeckInput, DeleteDeckInput, UpdateDeckInput } from '../graphql';

@Resolver()
@UseGuards(AuthGuard)
export class DecksResolver {
  constructor(private decksService: DecksService) {}

  @Query()
  async getDecks(@CurrentUser() userId: string) {
    return this.decksService.findAll(userId);
  }

  @Mutation()
  async createDeck(
    @Args('input') input: CreateDeckInput,
    @CurrentUser() userId: string
  ) {
    return this.decksService.create(userId, input.name);
  }

  @UseGuards(DeckOwnerGuard)
  @Mutation()
  async updateDeck(@Args('input') input: UpdateDeckInput) {
    return this.decksService.update(input.deckId, input.name);
  }

  @UseGuards(DeckOwnerGuard)
  @Mutation()
  async deleteDeck(@Args('input') input: DeleteDeckInput) {
    return this.decksService.delete(input.deckId);
  }
}
