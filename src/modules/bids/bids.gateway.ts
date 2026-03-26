import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class BidsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(_client: Socket) {}

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('join_lot')
  handleJoinLot(
    @MessageBody() body: { lotId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.lotId) {
      return { ok: false };
    }

    client.join(`lot:${body.lotId}`);
    return { ok: true, room: `lot:${body.lotId}` };
  }

  @SubscribeMessage('leave_lot')
  handleLeaveLot(
    @MessageBody() body: { lotId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.lotId) {
      return { ok: false };
    }

    client.leave(`lot:${body.lotId}`);
    return { ok: true, room: `lot:${body.lotId}` };
  }

  emitBidCreated(lotId: string, payload: any) {
    this.server.to(`lot:${lotId}`).emit('bid_created', payload);
  }

  emitLotUpdated(lotId: string, payload: any) {
    this.server.to(`lot:${lotId}`).emit('lot_updated', payload);
  }
}