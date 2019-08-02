import { Field, ID, ObjectType } from 'type-graphql'
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Tenant } from '@app/tenant/models/tenant.model'
import { Conversation } from '@app/conversation/models/conversation.model'
import { User } from '@app/user/models/user.model'

@ObjectType()
@Entity()
export class Workspace {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column('varchar', { length: 50 })
  name: string

  @Field()
  @Column({ length: 500, default: '' })
  description: string

  @Field(type => Tenant)
  @ManyToOne(type => Tenant, tenant => tenant.workspaces)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant

  @Field(type => [Conversation])
  @ManyToMany(type => Conversation, conversation => conversation.users)
  conversations: Conversation[]

  @Field(type => [User])
  @ManyToMany(type => User, user => user.workspaces)
  users: User[]

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date
}
