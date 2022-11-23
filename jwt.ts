import { Subject, from, of, pipe, map, reduce, startWith, flatMap, takeLast } from 'https://deno.land/x/rxjs@v1.0.2/mod.ts';
import * as base64 from 'https://denopkg.com/chiefbiiko/base64/mod.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

type Header = {
  alg: string;
  typ: string;
}

type ClaimSet = {
	foo: number;
  bar: number;
}

const header = {
  alg: 'HS256',
  typ: 'JWT',
};
const claimSet = {
  foo: 0,
  bar: 2,
}; // TODO: fooとかじゃなくてuidとかissとか現実的に
const secretKey = 'MY_SECERT_KEY';

const mergeClaimSet = (claimSet: ClaimSet, payload: object) => ({ ...claimSet, ...payload });
const encode = (data: object) => base64.fromUint8Array(new TextEncoder().encode(JSON.stringify(data)));
const sign = (data: string, key: string) => `${data}.${hmac('sha256', key, data, 'utf8', 'hex')}`;

export const generate = pipe(
  map(payload => mergeClaimSet(claimSet, payload)),
  startWith(header),
  map(encode),
  reduce((acc, cur) => `${acc}.${cur}`),
  map(unsigned => sign(unsigned, secretKey)),
);

// generate(of({ foo: 1 })).subscribe(console.log);
