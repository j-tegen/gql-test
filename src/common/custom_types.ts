import { registerEnumType } from 'type-graphql'
import { CustomerTypes } from '@app/tenant/tenant.enums'

registerEnumType(CustomerTypes, {
  name: 'CustomerType',
  description: 'The possible types a customer can have',
})
