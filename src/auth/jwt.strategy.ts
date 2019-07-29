import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../user/user.service'
import { JwtPayload } from '@app/types/jwt.payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'veryverysecret',
    })
  }

  async validate({ email }: JwtPayload) {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
