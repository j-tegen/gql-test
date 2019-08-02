import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Workspace } from './models/workspace.model'
import { Repository } from 'typeorm'
import { User } from '@app/user/models/user.model'
import { Tenant } from '@app/tenant/models/tenant.model'

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>
  ) {}

  async createWorkspace(
    payload: Partial<Workspace>,
    user: User,
    tenant: Tenant
  ): Promise<Workspace> {
    const workspace: Workspace = await this.workspaceRepository.create(payload)
    workspace.users = [user]
    workspace.tenant = tenant
    return this.workspaceRepository.save(workspace)
  }

  async addUser(workspace: Workspace, user: User): Promise<Workspace> {
    const currentUsers: User[] = workspace.users
    workspace.users = Array.from(new Set([...currentUsers, user]))
    return this.workspaceRepository.save(workspace)
  }

  async removeUser(workspace: Workspace, user: User): Promise<Workspace> {
    const currentUsers: User[] = workspace.users
    workspace.users = currentUsers.filter((u: User) => u.id !== user.id)
    return this.workspaceRepository.save(workspace)
  }

  async getWorkspace(id: number, userId: number): Promise<Workspace> {
    return this.workspaceRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.users', 'user')
      .where('workspace.id = :id AND user.id = :userId', { id, userId })
      .getOne()
  }

  async getTenantWorkspaces(tenantId: number): Promise<Workspace[]> {
    return this.workspaceRepository
      .createQueryBuilder('workspace')
      .where('tenantId = :tenantId', { tenantId })
      .getMany()
  }

  async getUserWorkspaces(userd: number): Promise<Workspace[]> {
    return this.workspaceRepository
      .createQueryBuilder('workspace')
      .where('userd = :userd', { userd })
      .getMany()
  }
}
