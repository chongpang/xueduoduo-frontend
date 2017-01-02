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

// xAPI
var conf = {
    "endpoint": "http://128.199.71.119:6061/lrs/data/xAPI/",
    "auth": "Basic " + toBase64('517a95278142c1ee3e9b81228097a32c0540f32d:0785215b8b4e446fdd887ef7d7995169a63a4d6b'),
};
//////////////////////////////////////////

ADL.XAPIWrapper.changeConfig(conf);



