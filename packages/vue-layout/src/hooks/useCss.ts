// @ts-ignore
import styles from '../styles/index.less';

export function useCssModules() {
  return {
    collapsedCls: styles['collapsed'],
    showCls: styles['show'],
    // layout classes
    layoutCls: styles['ajs-layout'],
    isRowCls: styles['is-row'],
    isMixCls: styles['is-mix'],
    headerCls: styles['ajs-layout-header'],
    headerLeftCls: styles['ajs-layout-header--left'],
    headerWrapperCls: styles['ajs-layout-header--wrapper'],
    headerActionCls: styles['ajs-layout-header--action'],
    headerPlaceholderCls: styles['ajs-layout-header--placeholder'],
    headerTriggerCls: styles['ajs-layout-header--trigger'],
    headerTriggerInnerCls: styles['ajs-layout-header--trigger-inner'],
    footerCls: styles['ajs-layout-footer'],
    sidebarCls: styles['ajs-layout-sidebar'],
    sidebarWrapperCls: styles['ajs-layout-sidebar--wrapper'],
    sidebarPlaceholderCls: styles['ajs-layout-sidebar--placeholder'],
    sidebarOverlayCls: styles['ajs-layout-sidebar--overlay'],
    sidebarTriggerCls: styles['ajs-layout-sidebar--trigger'],
    sidebarTriggerInnerCls: styles['ajs-layout-sidebar--trigger-inner'],
    contentCls: styles['ajs-layout-content'],
    logoCls: styles['ajs-layout-logo'],
    // menu classes
    menuCls: styles['ajs-menu'],
    menuItemCls: styles['ajs-menu-item'],
    menuItemIconCls: styles['ajs-menu-item--icon'],
    menuItemLabelCls: styles['ajs-menu-item--label'],
    menuItemTriggerCls: styles['ajs-menu-item--trigger'],
    submenuCls: styles['ajs-menu-submenu'],
    submenuInnerCls: styles['ajs-menu-submenu-item'],
  };
}

export function useCssVars() {
  return {
    getSidebarWidth: '210px',
    getSidebarCollapsedWidth: '48px',
    getHeaderHeight: '60px',
    getFooterHeight: '60px',
  };
}
