import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (String(user.status || '').toUpperCase() !== 'ACTIVE') {
      throw new ForbiddenException('Compte non actif');
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    await this.usersService.updateLastLogin(user.id);

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    const payload = {
      sub: user.id,
      email: user.email,
      role: String(user.role),
      status: String(user.status),
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      full_name: fullName,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: payload,
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (String(user.status || '').toUpperCase() !== 'ACTIVE') {
      throw new ForbiddenException('Compte non actif');
    }

    return {
      id: user.id,
      email: user.email,
      role: String(user.role),
      status: String(user.status),
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      full_name: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
      is_email_verified: user.isEmailVerified,
      is_phone_verified: user.isPhoneVerified,
      phone: user.phone || null,
      language_code: user.languageCode || null,
      last_login_at: user.lastLoginAt || null,
      created_at: user.createdAt,
      updated_at: user.updatedAt || null,
    };
  }

        async register(data: any) {
    const email = String(data?.email || '').trim().toLowerCase();
    const password = String(data?.password || '');
    const firstName = String(data?.firstName || '').trim();
    const lastName = String(data?.lastName || '').trim();
    const phone = data?.phone ? String(data.phone).trim() : null;

    if (!firstName) {
      throw new BadRequestException('Le prenom est obligatoire');
    }
    if (!lastName) {
      throw new BadRequestException('Le nom est obligatoire');
    }
    if (!email) {
      throw new BadRequestException("L adresse e-mail est obligatoire");
    }
    if (!password || password.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caracteres');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email } as any,
    });

    if (existingUser) {
      throw new BadRequestException('Un compte existe deja avec cette adresse e-mail');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      passwordHash,
      role: 'buyer',
      status: 'active',
    } as any);

    console.log('REGISTER USER PAYLOAD =', user);
let saved: any;
try {
  saved = await this.usersRepository.save(user as any);
} catch (e) {
  console.error('REGISTER ERROR =', e);
  throw e;
}

    return {
      success: true,
      message: 'Compte cree avec succes',
      user: {
        id: saved.id,
        email: saved.email,
        firstName: saved.firstName,
        lastName: saved.lastName,
        fullName: saved.fullName,
        role: saved.role,
        status: saved.status,
      },
    };
  }

}