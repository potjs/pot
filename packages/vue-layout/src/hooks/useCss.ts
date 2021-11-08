// @ts-ignore
import styles from '../styles/index.less';

export function useCssModules() {
  return {
    collapsedCls: styles['collapsed'],
    showCls: styles['show'],
    activeCls: styles['active'],
    // layout classes
    layoutCls: styles['pot-layout'],
    isRowCls: styles['is-row'],
    isMixCls: styles['is-mix'],
    headerCls: styles['pot-layout-header'],
    headerLeftCls: styles['pot-layout-header--left'],
    headerWrapperCls: styles['pot-layout-header--wrapper'],
    headerActionCls: styles['pot-layout-header--action'],
    headerPlaceholderCls: styles['pot-layout-header--placeholder'],
    headerTriggerCls: styles['pot-layout-header--trigger'],
    headerTriggerInnerCls: styles['pot-layout-header--trigger-inner'],
    footerCls: styles['pot-layout-footer'],
    sidebarCls: styles['pot-layout-sidebar'],
    sidebarWrapperCls: styles['pot-layout-sidebar--wrapper'],
    sidebarPlaceholderCls: styles['pot-layout-sidebar--placeholder'],
    sidebarOverlayCls: styles['pot-layout-sidebar--overlay'],
    sidebarTriggerCls: styles['pot-layout-sidebar--trigger'],
    sidebarTriggerInnerCls: styles['pot-layout-sidebar--trigger-inner'],
    contentCls: styles['pot-layout-content'],
    logoCls: styles['pot-layout-logo'],
    // menu classes
    menuCls: styles['pot-menu'],
    menuDarkCls: styles['pot-menu--dark'],
    menuLightCls: styles['pot-menu--light'],
    menuItemCls: styles['pot-menu-item'],
    menuItemIconCls: styles['pot-menu-item--icon'],
    menuItemLabelCls: styles['pot-menu-item--label'],
    menuItemTriggerCls: styles['pot-menu-item--trigger'],
    submenuCls: styles['pot-menu-submenu'],
    submenuInnerCls: styles['pot-menu-submenu-item'],
    submenuContentCls: styles['pot-menu-submenu-content'],
  };
}
