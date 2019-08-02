import { User } from './models/user.model'
import { UserService } from './user.service'
import { NotFoundException, UseGuards } from '@nestjs/common'
import {
  Mutation,
  Args,
  Resolver,
  Query,
  Parent,
  ResolveProperty,
} from '@nestjs/graphql'
import { UserArgs } from './dto/arguments'
import { GqlAuthGuard } from '@app/auth/graphql-auth.guard'
import { User as CurrentUser } from '../auth/user.decorator'
import { TenantService } from '@app/tenant/tenant.service'
import { Tenant } from '@app/tenant/models/tenant.model'

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService
  ) {}

  @Query(returns => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async user(
    @Args('id') id: number,
    @CurrentUser() currentUser: User
  ): Promise<User> {
    const tenantId: number = currentUser.tenant.id
    const user: User = await this.userService.getUserById(id, tenantId)
    if (!user) {
      throw new NotFoundException(id)
    }
    return user
  }

  @Query(returns => [User])
  @UseGuards(GqlAuthGuard)
  async users(@CurrentUser() currentUser: User): Promise<User[]> {
    return this.userService.getUsers(currentUser.tenant.id)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async addUser(
    @CurrentUser() currentUser: User,
    @Args('user') user: UserArgs
  ): Promise<User> {
    return this.userService.createUser(user, currentUser.tenant)
  }

  @ResolveProperty()
  async tenant(@Parent() user): Promise<Tenant> {
    return this.tenantService.getTenant(user.tenantId)
  }
}
