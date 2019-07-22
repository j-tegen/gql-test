import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@ObjectType()
@Entity()
export class Tenant {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column('varchar', { length: 50 })
  name: string

  @Field()
  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date
}
