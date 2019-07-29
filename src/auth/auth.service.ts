import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { User } from '../user/models/user.model'
import { JwtPayload } from '@app/types/jwt.payload'
import { JWT } from '@app/types/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async createToken(email): Promise<JWT> {
    const expiresIn: number = 60 * 60 * 24
    const user = { email }
    const accessToken = this.jwtService.sign(user)

    return { expiresIn, accessToken }
  }

  async validateUser({ email }: JwtPayload): Promise<User> {
    if (email) {
      return this.userService.getUserByEmail(email)
    }

    return null
  }
}
