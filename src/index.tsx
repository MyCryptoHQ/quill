import React from 'react';
import { render } from 'react-dom';

import Root from './Root';

// disables drag-and-drop due to potential security issues by Cure53 recommendation
const doNothing = (event: DragEvent) => {
  event.preventDefault();
  return false;
};
document.addEventListener('dragover', doNothing, false);
document.addEventListener('drop', doNothing, false);

render(<Root />, document.getElementById('app'));
