import { Field, ID, ObjectType } from 'type-graphql'
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
  JoinColumn,
} from 'typeorm'
import { Roles } from '../user.enums'
import { Tenant } from '@app/tenant/models/tenant.model'
import * as shortid from 'shortid'

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryColumn('varchar', {
    length: 10,
  })
  id: string

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

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date

  @BeforeInsert()
  async setId() {
    this.id = shortid.generate()
  }
}
