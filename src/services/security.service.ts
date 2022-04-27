import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import MD5 from 'crypto-js/MD5';
import {User} from '../models';
const generator = require('generate-password');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class SecurityService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  GeneratePassword(
    length: number,
    hasNumbers: boolean = true,
    hasLowercase: boolean = false,
    hasUppercase: boolean = false,
  ): string {
    var generatedPassword = generator.generate({
      length: length,
      numbers: hasNumbers,
      lowercase: hasLowercase,
      uppercase: hasUppercase,
    });
    return generatedPassword;
  }

  CryptPassword(generatedPassword: any): string {
    return MD5(generatedPassword).toString();
  }

  CreateTokenJWT(user: User): string {
    let secretKey = process.env.JWT_KEY;
    let token = jwt.sign(
      {
        data: {
          name: user.fullname,
          role: user.roleId,
        },
      },
      secretKey,
      {
        expiresIn: '24h',
      },
    );
    return token;
  }

  VerifyToken(token: string, role: string): string {
    try {
      var decoded = jwt.verify(token, process.env.JWT_KEY);
      //console.log(decoded.data.role);
      console.log(decoded);
      if (decoded.data.role == role) {
        return 'OK';
      } else {
        return 'KO';
      }
    } catch (err) {
      console.log(err);
      return 'EX';
    }
  }
}
