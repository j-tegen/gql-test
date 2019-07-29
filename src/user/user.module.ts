import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './models/user.model'
import { AuthModule } from '@app/auth/auth.module'
import { TenantService } from '@app/tenant/tenant.service'
import { Tenant } from '@app/tenant/models/tenant.model'

@Module({
  imports: [TypeOrmModule.forFeature([User, Tenant]), AuthModule],
  providers: [UserResolver, UserService, TenantService],
})
export class UserModule {}
