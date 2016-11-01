import React from 'react';

import routes from './routes';
import render from '@sketchpixy/rubix/lib/node/router';
import l20n from '@sketchpixy/rubix/lib/L20n';

l20n.initializeLocales({
  'locales': ['en-US', 'ch'],
  'default': 'ch'
});

render(routes, () => {
  l20n.ready();
});

if (module.hot) {
  module.hot.accept('./routes', () => {
    // reload routes again
    require('./routes').default
    render(routes);
  });
}
