import { ObjectType, Field, ID } from 'type-graphql'
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '@app/user/models/user.model'
import { Tenant } from '@app/tenant/models/tenant.model'
import { Message } from '@app/message/models/message.model'
import { Workspace } from '@app/workspace/models/workspace.model'

@ObjectType()
@Entity()
export class Conversation {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: string

  @Field({ nullable: true })
  @Column('varchar', { length: 50 })
  name?: string

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date

  @Field(type => [User])
  @ManyToMany(type => User, user => user.conversations, {
    cascade: true,
  })
  @JoinTable()
  users: User[]

  @Field(type => Tenant)
  @ManyToOne(type => Tenant, tenant => tenant.conversations)
  tenant: Tenant

  @Field(type => Workspace)
  @ManyToOne(type => Workspace, workspace => workspace.conversations)
  workspace: Workspace

  @Field(type => [Message], { nullable: true })
  @OneToMany(type => Message, message => message.conversation)
  messages: Message[]
}
