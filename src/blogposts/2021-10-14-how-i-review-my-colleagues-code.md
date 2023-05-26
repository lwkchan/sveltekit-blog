---
date: 2021-10-14T08:47:28.437Z
title: How to avoid perfectionism get in the way of code reviews
intro: >-
  Code reviews are a really awesome way to bring a team together and share
  knowledge. But, as a perfectionist, I've had to evolve my habits to make sure
  my code reviews did not slow down delivery
---
Reviewing code is hard. The new feature could be working well, linters running green and tests passing. But then as you scroll through, you notice a variable name here, the lack of unit test there, or the overengineering (or underengineering) of a function. You comment and ask for all the changes. The review cycle starts again and, perhaps, you find more tiny faults. You want the code to be the best as it can be, but long review cycles only delay product delivery.

I highly relate to the above story. I was an extremely pedantic reviewer in the early part my career. I remember my manager telling me in a 1:1 that my team was slow; he didn't specify exactly why, but I am sure it had something to do with my pedantic code reviews.

A few years into my career and I have now review code more quickly and effectively. I still use a fine-toothed comb to check that code is maintainable and in a good shape before shipping.

No doubt tooling has a big part of it. I think that if something can be automated (e.g. trailing commas or never using implicit returns), you should always verge on the side of letting a linter define the company's code style so that reading and reviewing the code takes a minimal amount of effort. But for issues that cannot be automated like this, I've found the following tips helpful. They make sure that I review code with little stress, with a good bar of quality and with a view to ship to production in good time.

## Treat code reviews as a conversation starter

I want to practise transparency and openness in my communication at work and code reviews are no exception. I would rather tell you something is on my mind than expect the thought to go away with time. If something feels a bit off, open the conversation. Even if no code gets changed as a result, the reviewee still learns something new, whether that be a new technical idea or perhaps about the reviewers personal preferences. Opening conversations in code reviews encourages exchange of technical ideas, whether that be in writing or in face-to-face opportunities like pair programming.

## If you know it's a nit, just label it as one

There is definitely a cultural element in this (the polite British person in me) or even something about being a woman: I used to agonise over how a comment would come across if I wanted to open a conversation as above, but it was about something which was really pedantic. I would spend ages writing and then deleting a sentence or tweaking words, thinking "how can I write this so I don't sound so aggressive".

A colleague gave me a really good tip on avoiding this thought process: if you know it's a nitpick just label it as one. With this in mind, when I write this kind of comment now, I always prefix it with \`nitpick:\`. This simple solution saves me so much time and effort of how to write a message in a polite way. Now, whenever I start working with someone new, I make sure to tell them, if it's a nitpick that I want to share, that doesn't necessarily have to change, I will prefix the review with \`nitpick\`.

## Take any personality out of the code

It is never a good idea to ask "How would I have written this". We have to admit that in code there is no one way to write a feature. And centering yourself on "how would I write this" closes the door to other possible solutions that could be better or even clearer to other people. It is better to ask questions more around readability and maintainability; if you read this code in a few months' time, would you still be able to understand what's going on and add a new feature if needed. Then, if you are unclear about anything, exercise the first tip and open the conversation and then make any changes if needed. 

## Write a comment and link a ticket

If there's a comment in the code review that cannot be solved now because of time pressure or because the change might cause an even bigger change across the system (I'm looking at you type changes), write a comment like a\`TODO\`. And, so that you do not lose the comment in the vast sea of the codebase, write an accompanying issue ticket, with reference to the file and add a link to the ticket to the \`TODO\` comment. Maybe even add the link to the issue in the code review so you make extra sure it doesn't get lost. With the ticket written, you can then prioritise when and how you do the TODO accordingly.
