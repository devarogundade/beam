/* eslint-disable prettier/prettier */

import { ChatCompletionTool } from 'openai/resources';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getSales',
      description: 'This functions gets the list of sales of a merchant.',
      parameters: {
        type: 'object',
        properties: {
          merchant: {
            type: 'string',
            description: 'The merchant solidity Hex address.',
          },
          type: {
            type: 'number',
            description:
              'The type of sales. 0 is product, 1 is subscription. Optional',
          },
          fromDate: {
            type: 'date',
            description: 'The start date for the sales list. Optional.',
          },
          toDate: {
            type: 'date',
            description: 'The end date for the sales list. Optional.',
          },
        },
        required: ['merchant'],
      },
      strict: true,
    },
  },
  {
    type: 'function',
    function: {
      name: 'getProducts',
      description: 'This functions gets the list of products of a merchant.',
      parameters: {
        type: 'object',
        properties: {
          merchant: {
            type: 'string',
            description: 'The merchant solidity Hex address.',
          },
        },
        required: ['merchant'],
      },
      strict: true,
    },
  },
];
