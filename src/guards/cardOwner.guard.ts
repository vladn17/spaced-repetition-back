import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError, UserInputError } from 'apollo-server-fastify';
import { FastifyRequest } from 'fastify';
import { CardsService } from '../cards/cards.service';
import { DecksService } from '../decks/decks.service';
import { DeleteCardInput, EditCardInput, ScheduleCardInput } from '../graphql';

type Input = EditCardInput | DeleteCardInput | ScheduleCardInput;

@Injectable()
export class CardOwnerGuard implements CanActivate {
  constructor(
    private cardsService: CardsService,
    private decksService: DecksService
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const userId = ctx.getContext<{
      request: FastifyRequest & { user: string };
    }>().request.user;
    const args = ctx.getArgs<{ input: Input }>();
    const card = await this.cardsService.findById(args.input.id);
    if (!card) {
      throw new UserInputError('Incorrect input');
    }
    const deck = await this.decksService.findById(card.deckId);
    if (deck?.userId === userId) return true;
    else throw new ForbiddenError('No permission to access');
  }
}
