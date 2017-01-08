import React from 'react';

import routes from './routes';
import render from '@sketchpixy/rubix/lib/node/router';
import l20n from '@sketchpixy/rubix/lib/L20n';
var os = require("os");

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

// xAPI
var conf = {
    "endpoint": "http://" + os.hostname() + ":6061/data/xAPI/",
    "auth": "Basic " + toBase64('fd625428458e3fd93c50e17c981940f676756586:7669f08e404fbfd6433f53bd0ee5bd55046d0fce'),
};
//////////////////////////////////////////

ADL.XAPIWrapper.changeConfig(conf);



