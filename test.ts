let i = 5;

// type AA = { v: { vv: string } | undefined };
// type AA = { v: Array<string> };
type AA = Record<string, { a: string }>;

const b: AA = { v: { a: 'das' } };


const a = b.b.a;
const a = b.b[3]?.e;

const a = b?.v.a;
const a = b.v?.a;

export const isBoosterOnline = (boosterDetails: BoosterDetailsStore, id: string): boolean => {
  const alert = boosterDetails[id]?.alert;
  return !(alert?.isGet && alert?.type === 'error');
};

enum A {
    a = 'asf'
};

const field = 'ads';

interface G {
    [A.a]: string;
    asff: string;
    [field]: number;
}

interface GG {
    asf: string;
    asff: string;
    [field]: number;
}

const foo: G = { [A.a]: '54', asff: 'fre', 'ads': 54 }
const bar: GG = { asf: '545',  asff: 'freasd', 'ads': 55 }

function de(a: keyof G) {

}

console.log(i + 10);

class Abb {
    constructor (bb: string) {}

    // constructor (bb: string, gg: number) {}
}
