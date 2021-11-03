import { watchEffect } from 'vue';
import { setCssVar } from '../utils';
import { ThemeConfig } from '../enums';

/**
 * 更新主题配置信息
 * @param props
 */
export function useConfigureTheme(props: any) {
  watchEffect(() => {
    if (props.headerBackgroundColor) {
      setCssVar(ThemeConfig.HEADER_BACKGROUND_COLOR, props.headerBackgroundColor);
    }
  });
  watchEffect(() => {
    if (props.sidebarBackgroundColor) {
      setCssVar(ThemeConfig.SIDEBAR_BACKGROUND_COLOR, props.sidebarBackgroundColor);
    }
  });
}
