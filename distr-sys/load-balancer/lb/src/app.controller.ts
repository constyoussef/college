import { Controller, Get, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { getAvailableAlgorithms } from './algorithms/algorithm.factory';

/**
 * App Controller
 *
 * Main entry point for the load balancer.
 * GET /calc?n=5&algo=round_robin
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('calc')
  async calc(
    @Query('n') nParam: string,
    @Query('algo') algo: string,
    @Req() req: Request,
  ) {
    // Validate n
    const n = parseInt(nParam, 10);
    if (isNaN(n) || n < 1) {
      throw new HttpException(
        'Parameter "n" must be a positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate algorithm
    const available = getAvailableAlgorithms();
    if (!algo || !available.includes(algo)) {
      throw new HttpException(
        `Parameter "algo" must be one of: ${available.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Extract client IP
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    try {
      return await this.appService.handleCalcRequest(n, algo, clientIp);
    } catch (err) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get()
  info() {
    return {
      service: 'Load Balancer',
      version: '1.0.0',
      endpoints: {
        calc: 'GET /calc?n=<int>&algo=<algorithm>',
        metrics: 'GET /metrics',
        histogram: 'GET /metrics/histogram',
        reset: 'GET /metrics/reset',
        dashboard: 'GET /dashboard',
      },
      algorithms: getAvailableAlgorithms(),
    };
  }
}
