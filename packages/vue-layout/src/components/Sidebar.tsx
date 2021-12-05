import { defineComponent, unref, createVNode, Fragment } from 'vue';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { TriggerPlacement } from '../defaultSettings';
import { extendSlots } from '../utils';
import { Menu } from './Menu';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export default defineComponent({
  name: 'PotSidebar',
  emits: ['menu-select'],
  setup() {
    const { prefixCls, trigger, menuData } = useInjectSettings();
    const { isCollapsed, isMobile, hasSidebar, isFullHeader, getSlots, toggleSidebar } =
      useInjectShared();

    const slots = getSlots(['default:sidebar', 'trigger']);

    const renderContent = () => {
      return <>{menuData.value && <Menu options={menuData.value} />}</>;
    };

    const renderTrigger = () => {
      if (TriggerPlacement.BOTTOM !== trigger.value) {
        return null;
      }
      return createVNode(LayoutTrigger, null, { ...extendSlots(slots, ['default:trigger']) });
    };

    const renderLogo = () => {
      // show logo with full sidebar and mobile
      if (!(!isFullHeader.value || isMobile.value)) {
        return null;
      }
      return createVNode(LayoutLogo, { collapsed: isCollapsed.value });
    };

    const renderSidebar = () => {
      if (!hasSidebar.value) {
        return null;
      }

      return createVNode(Fragment, null, [
        createVNode('aside', {
          class: [`${prefixCls.value}-sidebar--placeholder`, { collapsed: isCollapsed.value }],
        }),
        createVNode(
          'aside',
          {
            class: [
              `${prefixCls.value}-sidebar`,
              {
                collapsed: isCollapsed.value,
                [`${prefixCls.value}-sidebar--mix`]: isFullHeader.value,
              },
            ],
          },
          [
            renderLogo(),
            createVNode('div', { class: `${prefixCls.value}-sidebar--wrapper` }, [renderContent()]),
            renderTrigger(),
          ],
        ),
      ]);
    };

    const renderMobileSidebar = () => {
      if (!menuData.value) {
        return null;
      }

      return createVNode(
        'div',
        {
          class: [
            `${prefixCls.value}-drawer`,
            { [`${prefixCls.value}-drawer--open`]: !isCollapsed.value },
          ],
        },
        [
          createVNode('aside', {
            class: `${prefixCls.value}-drawer--mask`,
            onClick: toggleSidebar,
          }),
          createVNode(
            'aside',
            {
              class: `${prefixCls.value}-sidebar`,
              ...(isCollapsed.value && {
                style: {
                  transform: 'translateX(-100%)',
                },
              }),
            },
            [
              renderLogo(),
              createVNode('div', { class: `${prefixCls.value}-sidebar--wrapper` }, [
                renderContent(),
              ]),
            ],
          ),
        ],
      );
    };

    return () => <>{unref(isMobile) ? renderMobileSidebar() : renderSidebar()}</>;
  },
});
