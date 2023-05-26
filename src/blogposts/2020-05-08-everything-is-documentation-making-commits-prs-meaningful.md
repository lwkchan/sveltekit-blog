---
slug: everything-is-documentation
date: 2020-05-08T10:09:47.223Z
title: Writing is everywhere
intro: >-
  It's not just about Clean Code. Compairing writing as a Public Relations
  executive vs. software developer
---
Before I became a software developer two years ago, I never would have thought that writing was such an integral part of the job. When I worked in PR/communications previously, I enjoyed writing; it was my favourite part of the job. But, even though communications and writing is in the name of the PR job, I can hands down say that I feel a lot more pressure writing as a developer now than I ever did in PR.

A lot of writing in PR was emails, journalist pitches and reports to clients - so perhaps counting number of words per day, I would have done more in PR. However, by added pressure, I mean that the words feel more purposeful in a personal way. This is because I am writing them for myself and for other people like me. I know what it's like to read documentation, both good and bad. And, if I care about the application I am working on, I care about the writing around it because I want the application to last.

## Writing for the moment vs. for the future

In PR, a lot of writing feels ephemeral. After you pitched a journalist by email, they'd normally reply with a short "No thanks", "Yea sure" or just ignored the message. After a client read a report they'd most likely just use it in their own reporting and file it away. With a thought leadership piece (i.e. a simple article for a publication), the publication would post it (usually online), most readers would find the article within those first few days of publication, then the article would just fade into the the swathe PR thought pieces.

I am not trying to sleight PRs or content writers who work in marketing - a lot of research and thought goes into these pieces. They have to grab people's attention in a short space of time (in the case of a journalist's pitch); be extremely relevant to the time of writing; effectively convey the tone of a particular company or executive; (in the case of business-to-business, or b2b PR) communicate complex ideas in a simple way.

In software development, writing is not just for the now, it's for the next developers who come after. And that doesn't only mean your immediate colleagues, it can be for yourself, when you revisit the code after a period of time long enough to forget why you made certain decisions; it can be for developers who need to fix a bug in that code; it can be for developers new to a codebase who have come extend the code with a new feature.

## Writing is everywhere

Writing in software development is most strongly associated with documentation. When I say to a colleague "Maybe we should write some documentation on this", I more literally mean that we should write a text document, most likely a Markdown file in a repository, explaining something that needs to be kept on file for later. 

However, in a broader sense, writing documentation isn't just this. It covers any kind of document that serves to explain something. This can be in prose, with code examples perhaps, or even just running example code. For me, tests are a huge source of documentation; they explain what output I can expect from running a piece of code with a certain input.

Focussing on prose-based documentation, in vague order of larger scale, to more in detail, this could include:
- What kinds of features an application has - namely API documentation
- Why a certain piece of technology was chosen to build something
- A post-mortem report explaining something which went wrong on a project
- What bugs or issues an application has
- How to get started with an application
- How to use an application (API documentation, for example)
- How to deploy the application to an environment
- A PR description saying what was added/fixed to an application
- A PR comment remarking on a piece of code
- A commit message to say what feature was added
- Comments on how a piece of code works
- Comments on what is left to do on an application (// TODOS)

This list is not exhaustive.

When I gave up working in PR (public relations) and do software development, I thought I would miss writing the most. But it turns out that writing would still be everywhere.

However, the biggest difference in writing as a developer is that I needed to be more deliberate about it. It's easy to stay focussed on code everyday, building new features and fixing bugs. But we need to deliberately stop and take the time to write documentation, otherwise future developers will be hard pressed to figure out why a decision was taken or how they can get started on contributing to a project.

Resources - some interesting articles on the importance of documentation
* [Designing a sustainable front-end toolset for FT.com](https://medium.com/ft-product-technology/designing-a-sustainable-front-end-toolset-for-ft-com-f37c59d27eeb)
* [You are what you document](https://www.ybrikman.com/writing/2014/05/05/you-are-what-you-document/)
* [The most important code isn't code](https://zachholman.com/posts/documentation/)
