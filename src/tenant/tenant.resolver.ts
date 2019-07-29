import { Tenant } from './models/tenant.model'
import { TenantService } from './tenant.service'
import { NotFoundException, UseGuards } from '@nestjs/common'
import { RegisterTenant } from './dto/arguments'
import { User as CurrentUser } from '../auth/user.decorator'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql'
import { User } from '@app/user/models/user.model'
import { UserService } from '@app/user/user.service'
import { GraphQLError } from 'graphql'
import { GqlAuthGuard } from '@app/auth/graphql-auth.guard'
import { Roles } from '@app/user/user.enums'

@Resolver(of => Tenant)
export class TenantResolver {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => Tenant)
  async tenant(@CurrentUser() currentUser: User): Promise<Tenant> {
    const { id } = currentUser.tenant
    const tenant: Tenant = await this.tenantService.getTenant(id)
    if (!tenant) {
      throw new NotFoundException(id)
    }
    return tenant
  }

  @Query(returns => [Tenant], { nullable: true })
  async tenants(): Promise<Tenant[]> {
    return await this.tenantService.getTenants()
  }

  @Mutation(returns => User)
  async register(@Args()
  {
    firstName,
    lastName,
    name,
    email,
    password,
  }: RegisterTenant) {
    const existingUser: User = await this.userService.getUserByEmail(email)

    if (existingUser) {
      throw new GraphQLError('User exists')
    }
    const tenant = await this.tenantService.createTenant({ name })
    const role: Roles = Roles.admin

    return this.userService.createUser(
      {
        email,
        password,
        firstName,
        lastName,
        role,
      },
      tenant
    )
  }

  @ResolveProperty()
  async users(@Parent() tenant): Promise<User[]> {
    return this.userService.getUsers(tenant.id)
  }
}
