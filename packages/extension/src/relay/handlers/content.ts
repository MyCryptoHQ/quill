import { is } from 'superstruct';

import { RelayMessageStruct, RelayResponseStruct, RelayTarget } from '../../types';
import { createBackgroundMessageSender } from '../background';

export const handleContentMessages = () => {
  const sendMessage = createBackgroundMessageSender(RelayTarget.Content, RelayTarget.Background);

  window.addEventListener('message', async (event: MessageEvent) => {
    if (!is(event.data, RelayMessageStruct) || event.data.target !== RelayTarget.Content) {
      return;
    }

    const response = await sendMessage(event.data);
    if (
      !is(response, RelayResponseStruct) ||
      response.id !== event.data.id ||
      response.target !== RelayTarget.Content
    ) {
      return;
    }

    window.postMessage({ ...response, target: RelayTarget.Page }, event.origin);
  });
};
