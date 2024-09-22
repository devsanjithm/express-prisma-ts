import { Strategy as JwtStrategy, ExtractJwt, type VerifyCallback } from 'passport-jwt';
import cacheService from '../services/cache.service.js';
import config from './config.js';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    // If (payload.type !== TokenType.ACCESS) {
    //   throw new Error('Invalid token type');
    // }
    const redisCachedUser = await cacheService.getFromCache(payload.sub);
    if (!redisCachedUser) {
      done(null, false);
      return;
    }

    done(null, redisCachedUser);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
