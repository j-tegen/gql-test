import { Field, ID, ObjectType } from 'type-graphql'
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Roles } from '../user.enums'
import { Tenant } from '@app/tenant/models/tenant.model'
import { Conversation } from '@app/conversation/models/conversation.model'
import { Message } from '@app/message/models/message.model'
import { Workspace } from '@app/workspace/models/workspace.model'

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ length: 100, unique: true })
  email: string

  @Field()
  @Column('varchar', { length: 50 })
  firstName: string

  @Field()
  @Column('varchar', { length: 50 })
  lastName: string

  @Field()
  @Column({ length: 50, default: '' })
  phone: string

  @Column({ length: 100, nullable: true, select: false })
  password: string | undefined

  @Column({ length: 100, nullable: true })
  passwordHash: string | undefined

  @Field()
  @Column({ default: false })
  verified: boolean

  @Field()
  @Column({ default: '' })
  validationToken: string

  @Field()
  @Column('enum', { enum: Roles, default: Roles.user })
  role: Roles

  @Field(type => Tenant)
  @ManyToOne(type => Tenant, tenant => tenant.users)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant

  @Field(type => [Conversation])
  @ManyToMany(type => Conversation, conversation => conversation.users)
  conversations: Conversation[]

  @Field(type => [Message])
  @OneToMany(type => Message, message => message.user)
  messages: Message[]

  @Field(type => [Workspace])
  @ManyToMany(type => Workspace, workspace => workspace.users)
  workspaces: Workspace[]

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date
}
