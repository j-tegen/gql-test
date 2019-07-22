import { Tenant } from './models/tenant.model'
import { TenantService } from './tenant.service'
import { NotFoundException } from '@nestjs/common'
import { NewTenant } from './dto/arguments'
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'

@Resolver(of => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(returns => Tenant)
  async tenant(@Args() id: string): Promise<Tenant> {
    const tenant: Tenant = await this.tenantService.getTenant(id)
    if (!tenant) {
      throw new NotFoundException(id)
    }
    return tenant
  }

  @Query(returns => [Tenant])
  async tenants(): Promise<Tenant[]> {
    return await this.tenantService.getTenants()
  }

  @Mutation(returns => Tenant)
  async createTenant(@Args() payload: NewTenant): Promise<Tenant> {
    return this.tenantService.createTenant(payload)
  }
}
