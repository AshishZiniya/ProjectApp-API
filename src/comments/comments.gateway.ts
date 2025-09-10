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
    origin: ['http://localhost:3000', 'http://localhost:3001'], // adjust if needed
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
    console.log(`Client ${client.id} joined room for task ${taskId}`);
  }

  @SubscribeMessage('leaveTaskComments')
  async handleLeaveTaskComments(
    @ConnectedSocket() client: Socket,
    @MessageBody() taskId: string,
  ): Promise<void> {
    await client.leave(taskId);
    console.log(`Client ${client.id} left room for task ${taskId}`);
  }
}
