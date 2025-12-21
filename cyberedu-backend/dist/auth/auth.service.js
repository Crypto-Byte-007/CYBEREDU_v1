"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const password_util_1 = require("../common/utils/password.util");
const config_service_1 = require("../config/config.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(registerDto) {
        const email = registerDto.email.toLowerCase();
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (!password_util_1.PasswordUtil.validateStrength(registerDto.password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long and include uppercase, lowercase and a number');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hash(registerDto.password);
        const user = await this.userModel.create({
            email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: registerDto.role || user_schema_1.UserRole.STUDENT,
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
    async login(loginDto) {
        const email = loginDto.email.toLowerCase();
        const user = await this.userModel.findOne({ email });
        if (!user) {
            this.logger.warn(`Login failed: user not found (${email})`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Login failed: wrong password (${email})`);
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
        return { message: 'Logout successful' };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const refreshTokenMatches = await password_util_1.PasswordUtil.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.jwt.secret,
            expiresIn: this.configService.jwt.expiration,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.jwt.secret,
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await password_util_1.PasswordUtil.hash(refreshToken);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    sanitizeUser(user) {
        const obj = user.toObject();
        delete obj.password;
        delete obj.refreshToken;
        delete obj.verificationToken;
        delete obj.passwordResetToken;
        delete obj.passwordResetExpires;
        return obj;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_service_1.AppConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map