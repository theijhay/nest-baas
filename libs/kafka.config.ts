import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

export const kafkaConfig: KafkaOptions['options'] = {
  client: {
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    connectionTimeout: parseInt(process.env.KAFKA_CONNECTION_TIMEOUT || '3000', 10),
    requestTimeout: parseInt(process.env.KAFKA_REQUEST_TIMEOUT || '30000', 10),
    clientId: 'email-service',
  },
  consumer: {
    groupId: 'email-consumer-group',
  },
};
