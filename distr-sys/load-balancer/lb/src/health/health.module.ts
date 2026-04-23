import { Module, Global } from '@nestjs/common';
import { HealthService } from './health.service';

/**
 * Health Module
 *
 * Global module providing the HealthService to all other modules.
 * Marked as @Global so it doesn't need to be imported everywhere.
 */
@Global()
@Module({
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
