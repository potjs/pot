import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed, PropType } from 'vue';
import { useCssModules } from '../../hooks/useCss';
import { useInjectConfig } from '../../hooks';

const { logoCls } = useCssModules();

export default defineComponent({
  name: 'PotLogo',
  props: {
    from: {
      type: String as PropType<'header' | 'sidebar'>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { collapsed, sidebarWidth, sidebarCollapsedWidth, headerHeight, isMobile } =
      useInjectConfig();

    const renderHeaderLogo = () => {
      const getStyles = computed(
        (): CSSProperties => ({
          height: unref(headerHeight),
          ...(unref(isMobile)
            ? {
                width: unref(sidebarCollapsedWidth),
              }
            : {
                width: unref(sidebarWidth),
              }),
        }),
      );

      return (
        <div class={logoCls} style={unref(getStyles)}>
          {slots.default?.({})}
        </div>
      );
    };

    const renderSidebarLogo = () => {
      const getStyles = computed(
        (): CSSProperties => ({
          height: unref(headerHeight),
          ...(unref(isMobile)
            ? {
                ...(!unref(collapsed) && {
                  width: unref(sidebarWidth),
                }),
              }
            : {
                width: unref(collapsed) ? unref(sidebarCollapsedWidth) : unref(sidebarWidth),
              }),
        }),
      );

      return (
        <div class={logoCls} style={unref(getStyles)}>
          {slots.default?.({})}
        </div>
      );
    };

    const inHeader = computed(() => props.from === 'header');
    const inSidebar = computed(() => props.from === 'sidebar');
    return () => (
      <>
        {unref(inHeader) && renderHeaderLogo()}
        {unref(inSidebar) && renderSidebarLogo()}
      </>
    );
  },
});
