/**
 * use Constants
 * @author Anguer
 */
import mapValues from 'lodash.mapvalues';

export type IRecord = [number, string];
export type IParams = {
  [k: string]: IRecord | IParams;
};
export type IConstant<T extends object> = Constant<T> & T;
export type ExtractValue<T> = {
  readonly [P in keyof T]: T[P] extends IRecord ? ConstantRecord : IConstant<ExtractValue<T[P]>>;
};

export type ExtractRecord<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends ConstantRecord ? K : never;
  }[keyof T]
>;
export type PureValue<T> = {
  readonly [P in keyof ExtractRecord<T>]: ConstantRecord;
} & {
  // [P in keyof T as T[P]['value']]: ConstantRecord;
  readonly [P: number]: ConstantRecord;
};

export type IConstantOptions = {
  formatter?: (t: string, raw: ConstantRecord) => string;
};

export class ConstantRecord {
  private readonly _key: string;
  private readonly _value: number;
  private readonly _label: string;
  private readonly options: IConstantOptions;

  constructor(key: string, value: number, label: string, options?: IConstantOptions) {
    this._key = key;
    this._value = value;
    this._label = label;

    this.options = options || {};
  }

  private get formatter() {
    return (
      this.options.formatter ||
      function (t) {
        return t;
      }
    );
  }

  get key() {
    return this._key;
  }

  get value() {
    return this._value;
  }

  get label() {
    return this.formatter(this._label, this);
  }
}

export class Constant<T extends object> {
  private readonly value: T;
  private readonly reverseValue: PureValue<T>;

  constructor(obj: T) {
    this.value = obj;

    this.reverseValue = ((dict: { [s: number | string]: any }) => {
      Object.values(this.value).forEach((t) => {
        if (t instanceof ConstantRecord) {
          dict[(dict[t.key] = t).value] = t;
        }
      });
      return dict as PureValue<T>;
    })(Object.create(null));

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop in this.value) {
          return Reflect.get(this.value, prop, receiver);
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
    });
  }

  toArray(): ConstantRecord[] {
    return Object.values(this.value).filter((value) => {
      return value instanceof ConstantRecord;
    });
  }

  get(key: keyof PureValue<T> | number): ConstantRecord {
    return this.reverseValue[key] || {};
  }
}

export function createConstant<T extends object>(obj: T): IConstant<T> {
  return new Constant(obj) as IConstant<T>;
}

export function createConstantRecord<T extends IParams>(
  obj: T,
  options?: IConstantOptions,
): IConstant<ExtractValue<T>> {
  return createConstant(
    // use 'lodash/mapValues'
    mapValues(obj, (value, key) => {
      const val = value as IRecord;
      if (Array.isArray(val)) {
        return new ConstantRecord(key, val[0], val[1], options);
      } else {
        return createConstantRecord(val, options);
      }
    }) as ExtractValue<T>,
    // Object.fromEntries(
    //   Object.entries(obj).map(([key, value]) => {
    //     const val = value as IRecord;
    //     if (Array.isArray(val)) {
    //       return [key, new ConstantRecord(key, val[0], val[1], options)];
    //     } else {
    //       return [key, createConstantRecord(val, options)];
    //     }
    //   }),
    // ) as ExtractValue<T>,
  );
}

// const constant = createConstantRecord(
//   {
//     user: {
//       admin: [1, 'admin'],
//       editor: [2, 'editor'],
//       test: {
//         aaa: [11, 'aaa'],
//         bbb: [22, 'bbb'],
//       },
//     },
//     test: [3, 'test'],
//   },
//   {
//     formatter: (t, o) => `#-${o.value}-${t}`,
//   },
// );
//
// console.log(constant.user.admin);
// console.log(constant.user.test.toArray());
// console.log(constant.user.editor.label);
// console.log(constant.test.value);
// console.log(constant.user.test.get('aaa'));
// console.log(constant.user.toArray());
// console.log(constant.toArray());
// console.log(constant.get(3));
