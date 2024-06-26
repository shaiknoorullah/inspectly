import { Module } from '@nestjs/common'
import { BookingService } from './booking.service'
import { BookingController } from './booking.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { SocketGateway } from '@/gateways/socket.gateway'
import { RedisService } from '@/redis/redis.service'
import { PaymentModule } from '@/payment/payment.module'
import { MechanicService } from '@/user/mechanic/mechanic.service'

@Module({
  imports: [PaymentModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    PrismaService,
    SocketGateway,
    RedisService,
    MechanicService,
  ],
})
export class BookingModule {}
