const bcrypt = require('bcryptjs')
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './models/user.model'
import { Repository } from 'typeorm'
import { generateToken } from '@app/common/hash'
import { Tenant } from '@app/tenant/models/tenant.model'

@Injectable()
export class UserService {
  private saltRounds: number = 10
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async createUser(
    payload: Partial<User>,
    tenant: Tenant
  ): Promise<User> {
    const passwordHash: string = await this.getPasswordHash(payload)
    const user: User = await this.userRepository.create({
      ...payload,
      passwordHash,
      password: '',
    })
    user.tenant = tenant
    return this.userRepository.save(user)
  }

  public async getUserById(id: number, tenantId: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.tenant', 'tenant')
      .where('user.id = :id AND tenantId = :tenantId', { id, tenantId })
      .getOne()
  }
  public async getUserByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.tenant', 'tenant')
      .where('user.email = :email', { email })
      .getOne()
  }

  public async getUsers(tenantId: number): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.tenant', 'tenant')
      .where('tenant.id = :tenantId', { tenantId })
      .getMany()
  }

  public async getConversationUsers(conversationId: number): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.conversations', 'conversation')
      .where('conversation.id = :conversationId', { conversationId })
      .getMany()
  }

  public async getWorkspaceUsers(workspaceId: number): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.workspaces', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId })
      .getMany()
  }

  private async getPasswordHash(payload: Partial<User>) {
    const { password } = payload
    if (password) {
      return this.getHash(password)
    }
    return generateToken()
  }

  public async compareHash(
    password: string | undefined,
    hash: string | undefined
  ): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  private async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }
}
