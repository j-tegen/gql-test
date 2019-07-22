import { Injectable } from '@nestjs/common'
import { Tenant } from './models/tenant.model'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NewTenant } from './dto/arguments'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async createTenant(payload: NewTenant): Promise<Tenant> {
    return await this.tenantRepository.save(payload)
  }

  async getTenants(): Promise<Tenant[]> {
    return await this.tenantRepository.find()
  }

  async getTenant(id: string): Promise<Tenant> {
    return this.tenantRepository.findOne(id)
  }
}
