import { withInstall } from '@app/shared';

import basicNavBar from './index.vue';

const BasicNavBar = withInstall(basicNavBar);

export { BasicNavBar };

export default BasicNavBar;

export { basicBarNavProps, type BasicBarNavProps, type IPublicShareSheetHeader } from './props';
