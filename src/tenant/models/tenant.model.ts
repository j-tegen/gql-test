import { Field, ID, ObjectType } from 'type-graphql'
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm'
import { User } from '@app/user/models/user.model'
import { CustomerTypes } from '../tenant.enums'
import { Conversation } from '@app/conversation/models/conversation.model'
import { Workspace } from '@app/workspace/models/workspace.model'

@ObjectType()
@Entity()
export class Tenant {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column('varchar', { length: 50 })
  name: string

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date

  @Field(type => CustomerTypes)
  @Column('enum', { enum: CustomerTypes, default: CustomerTypes.trial })
  customerType: CustomerTypes

  @Field(type => [User])
  @OneToMany(type => User, user => user.tenant)
  users: User[]

  @Field(type => [Workspace])
  @OneToMany(type => Workspace, workspace => workspace.tenant)
  workspaces: Workspace[]

  @Field(type => [Conversation])
  @ManyToOne(type => Conversation, conversation => conversation.tenant)
  @JoinColumn({ name: 'conversationId' })
  conversations: Conversation[]
}
