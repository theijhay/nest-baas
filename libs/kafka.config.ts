import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

export const kafkaConfig: KafkaOptions['options'] = {
  client: {
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    clientId: 'email-service',
  },
  consumer: {
    groupId: 'email-consumer-group',
  },
};
