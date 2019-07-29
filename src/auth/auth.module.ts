import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { Tenant } from '@app/tenant/models/tenant.model'
import { User } from '@app/user/models/user.model'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { UserService } from '@app/user/user.service'
import { TenantService } from '@app/tenant/tenant.service'
import { AuthResolver } from './auth.resolver'

@Module({
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    UserService,
    TenantService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Tenant]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET || 'veryverysecret',
      signOptions: {
        expiresIn: 3600, // 1hr
      },
    }),
  ],
})
export class AuthModule {}
