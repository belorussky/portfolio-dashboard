import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server } from 'socket.io';
  import { PricesService } from './prices.service';
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000',
      credentials: false,
    },
  })
  export class PricesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private readonly logger = new Logger(PricesGateway.name);
    private intervalId?: NodeJS.Timeout;
  
    constructor(private readonly pricesService: PricesService) {}
  
    afterInit() {
      this.logger.log('PricesGateway initialized');
  
      // Send full snapshot on an interval
      this.intervalId = setInterval(() => {
        const updates = this.pricesService.tick();
        this.server.emit('priceUpdate', updates); // broadcast to all clients
      }, 2000); // every 2s
    }
  
    handleConnection(client: any) {
      this.logger.log(`Client connected: ${client.id}`);
  
      // send current prices as snapshot
      const prices = this.pricesService.getAllPrices();
      client.emit('priceSnapshot', prices);
    }
  
    handleDisconnect(client: any) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }
  