type Style<V extends Array<string>> = {
  defaultStyle: string;
  variants: {
    [k in V[number]]: {
      [k: string]: string;
    };
  };
  defaultVariants: {
    [k in V[number]]: string;
  };
};

type Variants<V extends Array<string>> = {
  [k in keyof Style<V>["variants"]]?: Style<V>['variants'][''];
};

export function getStyle<V extends Array<string>>(style: Style<V>) {
  return init;

  function init(variants?: Variants<V>) {
    let defaultStyle = style["defaultStyle"] || "";

    if (!variants) {
      const defaultVariantsEntry = Object.entries(style["defaultVariants"]) as [
        string,
        string
      ][];
      defaultVariantsEntry.forEach(([variant, value]) => {
        defaultStyle = defaultStyle.concat(
          " ",
          style["variants"][variant as V[number]][value]
        );
      });
    } else {
      // check to see if `variants` is a literal object.
      if (Object.getPrototypeOf(variants) !== Object.prototype) {
        throw new Error(`please provide a literal object as 'variants'`);
      }

      //check if variants is valid, against the predefined.
      //if it's empty object, no error is thrown, defaultVariants will be used.
      //if it has wrong props, then error will be thrown.
      isValidVariants(variants, style["variants"]);

      const vrsEntry = Object.entries({
        ...style["defaultVariants"],
        ...variants,
      }) as [string, string][];
      vrsEntry.forEach(([variant, value]) => {
        defaultStyle = defaultStyle.concat(
          " ",
          style["variants"][variant as V[number]][value]
        );
      });
    }

    return defaultStyle.trim();
  }
}

function isValidVariants(target: any, source: any) {
  for (let k in target) {
    if (!source[k]) throw new Error(`variant '${k}' is not valid!`);
  }
}
