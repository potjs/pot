import type { Plugin, App } from 'vue';
import { defineComponent } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import type { LayoutSettings } from '../defaultSettings';
import { defaultLayoutProps } from '../defaultSettings';
import { useProvideSettings, useProvideShared } from '../hooks/injection';
import useWindowResizeListener from '../hooks/windowResize';

const Layout = defineComponent({
  name: 'PotLayout',
  props: defaultLayoutProps,
  emits: ['menuSelect', 'update:collapsed'],
  setup(props: LayoutSettings, context) {
    {
      useProvideSettings(props);
      const state = useProvideShared(props, context);

      useWindowResizeListener(({ width }) => {
        // console.log('#on window resize', width);
        state.mobile = width - 1 < 992;
      });
    }

    /**
     * render all components of layout
     */
    return () => (
      <LayoutContainer>
        {/* render full header */ <LayoutFullHeader />}
        <LayoutContainer direction={'horizontal'}>
          {/* render sidebar */ <LayoutSidebar />}
          <LayoutContainer>
            {/* render multiple header */ <LayoutMultipleHeader />}
            {/* render content */ <LayoutContent />}
            {/* render footer */ <LayoutFooter />}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    );
  },
});

Layout.install = function (app: App) {
  app.component(Layout.name, Layout);
  return app;
};

export default Layout as typeof Layout & Plugin;
