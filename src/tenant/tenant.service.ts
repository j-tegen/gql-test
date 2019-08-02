import { Injectable } from '@nestjs/common'
import { Tenant } from './models/tenant.model'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async createTenant(payload: Partial<Tenant>): Promise<Tenant> {
    const tenant: Tenant = await this.tenantRepository.create(payload)
    return this.tenantRepository.save(tenant)
  }

  async getTenants(): Promise<Tenant[]> {
    return await this.tenantRepository.find()
  }

  async getTenant(id: number): Promise<Tenant> {
    return this.tenantRepository.findOne(id)
  }
}
