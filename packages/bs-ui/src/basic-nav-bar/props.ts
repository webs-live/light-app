import { buildProps, definePropType } from '@app/shared';
import { navBarProps } from 'vant';
import { ExtractPropTypes } from 'vue';

export interface IPublicShareSheetHeader {
  title: string;
  src: string;
  desc: string;
  rate: string | number;
}

export const extendBasicNavProps = buildProps({
  bgColor: {
    type: String,
    default: '#fff',
  },
  leftArrowColor: {
    type: String,
    default: 'rgb(150, 151, 153)',
  },
});

export const basicRightButtonProps = buildProps({
  theme: {
    type: definePropType<'dark' | 'light'>(String),
    default: 'light',
  },
  header: {
    type: definePropType<IPublicShareSheetHeader>(Object),
  },
});

export const basicBarNavProps = {
  ...navBarProps,
  ...extendBasicNavProps,
  ...basicRightButtonProps,
  clickable: {
    type: Boolean,
    default: false,
  },
};

export type BasicBarNavProps = ExtractPropTypes<typeof basicBarNavProps>;

export const basicShareSheetProps = buildProps({
  header: {
    type: definePropType<IPublicShareSheetHeader>(Object),
    required: true,
  },
});

export const basicShareSheetHeaderProps = buildProps({
  title: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  rate: {
    type: definePropType([String, Number]),
    default: 0.0,
  },
});
