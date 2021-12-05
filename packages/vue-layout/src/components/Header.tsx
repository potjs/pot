import { defineComponent, unref, createVNode, Fragment } from 'vue';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { TriggerPlacement } from '../defaultSettings';
import { extendSlots } from '../utils';
import { useInjectSettings, useInjectShared } from '../hooks/injection';
import { Menu } from './Menu';

const Header = defineComponent({
  name: 'PotHeader',
  setup() {
    const { prefixCls, trigger, menuData } = useInjectSettings();
    const { hasSidebar, isFullHeader, isMenuInHeader, isMobile, getSlots } = useInjectShared();

    const slots = getSlots(['default:header', 'logo', 'action', 'trigger']);

    const renderContent = () => {
      if (slots.default) {
        return createVNode(Fragment, null, [slots.default?.({})]);
      }
      // show menu with PC
      if (isMenuInHeader.value && !isMobile.value) {
        return createVNode(Menu, { options: menuData.value, horizontal: true });
      }
      return null;
    };

    const renderTrigger = () => {
      // show trigger with mobile or has sidebar
      if (!(hasSidebar.value || isMobile.value)) {
        return null;
      }
      if (TriggerPlacement.TOP !== trigger.value) {
        return null;
      }
      return createVNode(LayoutTrigger, null, { ...extendSlots(slots, ['default:trigger']) });
    };

    const renderLogo = () => {
      // show logo with full header and mobile
      if (!(isFullHeader.value || isMenuInHeader.value || isMobile.value)) {
        return null;
      }
      return createVNode(LayoutLogo, { collapsed: isMobile.value });
    };

    return () =>
      createVNode('header', { class: `${prefixCls.value}-header` }, [
        createVNode('div', { class: `${prefixCls.value}-header--left` }, [
          renderLogo(),
          renderTrigger(),
        ]),
        createVNode('div', { class: `${prefixCls.value}-header--wrapper` }, [renderContent()]),
        slots.action &&
          createVNode('div', { class: `${prefixCls.value}-header--action` }, [slots.action?.({})]),
      ]);
  },
});

const FullHeader = defineComponent({
  name: 'PotFullHeader',
  setup() {
    const { isFullHeader } = useInjectShared();
    return () => <>{unref(isFullHeader) && <Header />}</>;
  },
});

const MultipleHeader = defineComponent({
  name: 'PotMultipleHeader',
  setup() {
    const { prefixCls } = useInjectSettings();
    const { isFullHeader } = useInjectShared();
    return () => (
      <>
        <div class={`${prefixCls.value}-header--placeholder`} />
        {!unref(isFullHeader) && <Header />}
      </>
    );
  },
});

export { FullHeader, MultipleHeader };
