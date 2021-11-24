import useEventListener from './eventListener';

export interface WindowResizeCallback {
  width: number;
}
export default function useWindowResizeListener<T extends (obj: WindowResizeCallback) => void>(
  fn: T,
) {
  function resize() {
    fn({
      width: document.body.clientWidth,
    });
  }
  resize();

  useEventListener({
    el: window,
    name: 'resize',
    listener: () => {
      resize();
    },
  });
}
