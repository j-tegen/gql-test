import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '@app/user/models/user.model'
import { Tenant } from '@app/tenant/models/tenant.model'
import { Conversation } from '@app/conversation/models/conversation.model'

@ObjectType()
@Entity()
export class Message {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column('text')
  text: string

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, user => user.messages)
  user: User

  @Field(type => Conversation)
  @ManyToOne(type => Conversation, conversation => conversation.messages)
  conversation: Conversation

  @ManyToOne(type => Tenant, tenant => tenant.conversations)
  tenant: Tenant
}
