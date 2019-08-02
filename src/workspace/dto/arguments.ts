import { Field, InputType } from 'type-graphql'

@InputType()
export class NewWorkspace {
  @Field({ nullable: false })
  name: string

  @Field({ nullable: true })
  description?: string
}

@InputType()
export class WorkspaceUser {
  @Field({ nullable: false })
  workspaceId: number

  @Field({ nullable: false })
  userId: number
}
