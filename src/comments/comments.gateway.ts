import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['https://project-app-indol.vercel.app'], // adjust if needed
  },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinTaskComments')
  async handleJoinTaskComments(
    @ConnectedSocket() client: Socket,
    @MessageBody() taskId: string,
  ): Promise<void> {
    await client.join(taskId);
  }

  @SubscribeMessage('leaveTaskComments')
  async handleLeaveTaskComments(
    @ConnectedSocket() client: Socket,
    @MessageBody() taskId: string,
  ): Promise<void> {
    await client.leave(taskId);
  }
}
