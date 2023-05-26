---
date: 2020-09-20T17:29:24.229Z
title: 'TypeScript errors for humans: "no overload matches this call"'
intro: An explanation of what this error means so I feel less scared
---
I must have read the error in the title a thousand times until I finally learned its meaning this week. Here's a tip for everyone and myself: read the f*cking error message; break down the sentence into keywords and use that Google-flex to find out what it means.

Rather than search what 'overload' meant, I would appease the compiler by reading the types provided and trying to figure out how to fit the params or the return value to the valid type (or adding `// @ts-ignore` or `any`). This worked (since I _was_ actually trying to get closer to solving the error), but the error message still scared me because I think "wtf does that error message even mean". But now, thanks to these [TypeScript exercises](https://typescript-exercises.github.io/), I've finally learned what 'overload' means.

## What is an overload?

[or, here is where I'm lazy and mostly copy-paste from reputable sources (with references of course - I am not a monster).

You encounter overloads when you write any function in TS. From trusty Wikipedia, [function overloading](https://en.wikipedia.org/wiki/Function_overloading) is:

> the ability to create multiple functions of the same name with different implementations

TypeScript leans more on the 'same name' idea and applies this idea to a sinlge function. A single function can have different implementations; these different implementations are usually based in the kinds of inputs you give to the function.

From the [TS documentation](https://www.typescriptlang.org/docs/handbook/functions.html#overloads), we can see the function `pickCard` differs its return value depending on whether `typeof x` is an object (reading ahead that `.length` implies `x` to be an array) or a number. Giving `pickCard` an array will output a number, while a number will output a card object (`{suit: string, card: number}`).

```typescript
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}
```

Knowing that an array argument will only ever return a number, while a number argument will only return a card object, how do we type this? We give the function a list of overloads:

Slightly modified from the TS docs:

```typescript
function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number } {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

```
Now, when you use `pickCard()` function with an array of card object, TS will automatically tell you that the return value will be a number. It won't say 'oh it could be a number or a card object'; it will follow the overloads given to the function and find the return value suited to it.

So when I next see "no overload matches this call", it won't necessarily mean that I need to give it another overload, as illustrated above. It will more likely mean that I need to double check types and change them as needed. However, now know what an overload is, I feel less scared of the error message. 

## Resources
- [TypeScript exercises](https://typescript-exercises.github.io/). Highly recommend these to get to know TS better
- [TS documentation on overloads](https://www.typescriptlang.org/docs/handbook/functions.html#overloads). What I mostly copy-pasted from
