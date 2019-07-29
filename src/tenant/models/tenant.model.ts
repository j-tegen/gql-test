import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, Column, OneToMany, PrimaryColumn, BeforeInsert } from 'typeorm'
import { User } from '@app/user/models/user.model'
import { CustomerTypes } from '../tenant.enums'
import * as shortid from 'shortid'

@ObjectType()
@Entity()
export class Tenant {
  @Field(type => ID)
  @PrimaryColumn('varchar', {
    length: 10,
  })
  id: string

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

  @BeforeInsert()
  setId() {
    const id: string = shortid.generate()
    this.id = id
  }
}
