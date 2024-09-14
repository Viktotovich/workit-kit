import './styles.css';

import {domManager, domMain} from './components/dom-master.js';
import { changeListener } from './components/sub-to-changes.js';
changeListener.loadChanges()
import { logoDisplay } from './components/display-assist.js';

domManager.findDom();
//keep the default load as whatever for now, but change it to today or soon - looks better
domMain.defaultLoad("Work Tasks")

logoDisplay.initLogo()