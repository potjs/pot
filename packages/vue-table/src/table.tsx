import { defineComponent, ref, toRefs, unref, watchEffect } from 'vue';
import { drawLine } from './utils';

export default defineComponent({
  name: 'AjsTable',
  props: {
    height: {
      type: Number,
      default: 500,
    },
    width: {
      type: Number,
      default: 500,
    },
    data: {
      type: Array,
      default: () => new Array(100).fill(undefined),
    },
    rowHeight: {
      type: Number,
      default: 40,
    },
    borderColor: {
      type: String,
      default: '#d6a2a2',
    },
  },
  setup(props, {}) {
    const { height, width, data, rowHeight, borderColor } = toRefs(props);
    const ajs_table = ref<HTMLCanvasElement | null>(null);

    watchEffect(
      () => {
        console.log('#ajs_table', ajs_table);
        const ctx = unref(ajs_table)?.getContext('2d');
        console.log('#ctx', ctx, data.value);

        data.value.forEach((t, i) => {
          if (ctx) {
            console.log('---------draw---------');
            drawLine(
              ctx,
              0,
              i * unref(rowHeight),
              unref(width),
              i * unref(rowHeight),
              unref(borderColor),
            );
          }
        });
      },
      {
        flush: 'post',
      },
    );

    const scrollHandler = (e: any) => {
      console.log('#scrollHandler', e);
    };

    return () => (
      <>
        {/* render canvas */}
        <canvas
          ref={ajs_table}
          height={unref(height)}
          width={unref(width)}
          style={{ background: '#9ed9a1' }}
          onScroll={scrollHandler}
        />
      </>
    );
  },
});
