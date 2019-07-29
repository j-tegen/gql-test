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
import { NewUser } from './dto/arguments'
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
    @Args('id') id: string,
    @CurrentUser() currentUser: User
  ): Promise<User> {
    const tenantId: string = currentUser.tenant.id
    const user: User = await this.userService.getUserById(id, tenantId)
    if (!user) {
      throw new NotFoundException(id)
    }
    return user
  }

  // @Query(returns => [User])
  // async users(): Promise<User[]> {
  //   return this.userService.getUsers()
  // }

  // @Mutation(returns => User)
  // async addUser(@Args('user') user: NewUser): Promise<User> {
  //   return this.userService.createUser(user, )
  // }

  @ResolveProperty()
  async tenant(@Parent() user): Promise<Tenant> {
    return this.tenantService.getTenant(user.tenantId)
  }
}
