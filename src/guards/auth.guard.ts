import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-fastify';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const bearer = 'bearer';
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ request: FastifyRequest }>().request;
    const header = request.raw.headers.authorization;
    if (!header) throw new AuthenticationError('Must be authenticated');
    const token = header.slice(bearer.length).trim();
    try {
      const decoded = await this.jwtService.verifyAsync<{ userId: string }>(
        token
      );
      Object.assign(request, { user: decoded.userId });
      return true;
    } catch {
      throw new AuthenticationError('Must be authenticated');
    }
  }
}
