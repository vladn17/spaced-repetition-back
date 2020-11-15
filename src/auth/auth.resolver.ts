import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.authService.login(email, password);
  }

  @Mutation()
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.authService.signUp(email, password);
  }
}
