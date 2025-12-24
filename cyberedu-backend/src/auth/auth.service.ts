import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordUtil } from '../common/utils/password.util';
import { Tokens } from './interfaces/tokens.interface';
import { AppConfigService } from '../config/config.service';

interface AppJwtPayload {
  sub: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  // ================= REGISTER =================
  async register(registerDto: RegisterDto): Promise<any> {
    const email = registerDto.email.toLowerCase();

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (!PasswordUtil.validateStrength(registerDto.password)) {
      throw new BadRequestException(
        'Password does not meet security requirements',
      );
    }

    const hashedPassword = await PasswordUtil.hash(registerDto.password);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || UserRole.STUDENT,
      isActive: true,
      isVerified: true,
    });

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ================= LOGIN =================
  async login(loginDto: LoginDto): Promise<any> {
    const email = loginDto.email.toLowerCase();

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await PasswordUtil.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ================= LOGOUT =================
  async logout(userId: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
    return { message: 'Logout successful' };
  }

  // ================= REFRESH =================
  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userModel.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const matches = await PasswordUtil.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!matches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ================= JWT HELPERS =================
  private async generateTokens(user: UserDocument): Promise<Tokens> {
    const payload: AppJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = await this.jwtService.signAsync(
      payload as Record<string, any>,
      {
        secret: this.configService.jwt.secret,
        expiresIn: this.configService.jwt.accessExpiration as any,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      payload as Record<string, any>,
      {
        secret: this.configService.jwt.secret,
        expiresIn: this.configService.jwt.refreshExpiration as any,
      },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashed = await PasswordUtil.hash(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashed,
    });
  }

  private sanitizeUser(user: UserDocument): any {
    const obj = user.toObject();
    delete obj.password;
    delete obj.refreshToken;
    delete obj.verificationToken;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    return obj;
  }
}
