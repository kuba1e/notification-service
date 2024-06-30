import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";

const queueUrl = process.env.AWS_SQS_QUEUE_URL;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const consumer = Consumer.create({
  queueUrl,
  handleMessage: async (message) => {},
  sqs: new SQSClient({
    region: "eu-north-1",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  }),
});

export default consumer;
