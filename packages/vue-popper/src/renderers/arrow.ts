import { Comment, createVNode } from 'vue';
import { isString } from '../utils';

export default function renderArrow(showArrow: boolean | string) {
  return showArrow
    ? createVNode(
        'div',
        {
          ref: 'arrowRef',
          class: isString(showArrow) ? showArrow : '',
          'data-popper-arrow': '',
        },
        null,
      )
    : createVNode(Comment, null, '');
}
