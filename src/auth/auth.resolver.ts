import { User } from '../user/models/user.model'
import { UserService } from '../user/user.service'
import { Args, Resolver, Query } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { AuthService } from './auth.service'
import { JWT } from '@app/types/jwt'
import { LoginArgs } from './dto/arguments'

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Query(returns => JWT)
  async loginUser(@Args() { email, password }: LoginArgs) {
    const user: User = await this.userService.getUserByEmail(email)

    if (!user) {
      throw new GraphQLError('No such user!')
    }
    const isAuthenticated: boolean = await this.userService.compareHash(
      password,
      user.passwordHash
    )
    if (!isAuthenticated) {
      throw new GraphQLError('Wrong password!')
    }

    return this.authService.createToken(user.email)
  }
}
