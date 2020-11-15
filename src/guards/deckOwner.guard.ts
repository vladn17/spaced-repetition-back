import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError, UserInputError } from 'apollo-server-fastify';
import { FastifyRequest } from 'fastify';
import { DecksService } from '../decks/decks.service';
import {
  CreateCardInput,
  DeleteDeckInput,
  GetCardsInput,
  UpdateDeckInput,
} from '../graphql';

type Input =
  | DeleteDeckInput
  | UpdateDeckInput
  | GetCardsInput
  | CreateCardInput;

@Injectable()
export class DeckOwnerGuard implements CanActivate {
  constructor(private decksService: DecksService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const userId = ctx.getContext<{
      request: FastifyRequest & { user: string };
    }>().request.user;
    const args = ctx.getArgs<{ input: Input }>();
    const deck = await this.decksService.findById(args.input.deckId);
    if (!deck) {
      throw new UserInputError('Incorrect input');
    }
    if (deck.userId === userId) return true;
    else throw new ForbiddenError('No permission to access');
  }
}
