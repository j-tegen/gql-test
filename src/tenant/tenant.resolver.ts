import { Tenant } from './models/tenant.model'
import { TenantService } from './tenant.service'
import { NotFoundException } from '@nestjs/common'
import { NewTenant, RegisterTenantenant } from './dto/arguments'
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

@Resolver(of => Tenant)
export class TenantResolver {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService
  ) {}

  @Query(returns => Tenant)
  async tenant(@Args('id') id: string): Promise<Tenant> {
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
  }: RegisterTenantenant) {
    const existingUser: User = await this.userService.getUserByEmail(email)

    if (existingUser) {
      throw new GraphQLError('User exists')
    }
    const tenant = await this.tenantService.createTenant({ name })

    return this.userService.createUser(
      {
        email,
        password,
        firstName,
        lastName,
      },
      tenant
    )
  }

  @ResolveProperty()
  async users(@Parent() tenant): Promise<User[]> {
    return this.userService.getUsers(tenant.id)
  }
}
