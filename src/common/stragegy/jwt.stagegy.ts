import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/module/user/user.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || '',
    });
  }
  async validate(payload: { sub: number; email: string }) {
  try {
    const user = await this.userRepository.findById(payload.sub);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
}
