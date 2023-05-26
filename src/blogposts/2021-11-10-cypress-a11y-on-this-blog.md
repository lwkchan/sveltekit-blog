---
date: 2021-11-10T08:47:28.437Z
title: How I set up a11y testing on this blog
---

In order to learn more about accessiblity testing, I decided to set up Cypress testing with axe-core on this website. Setting this up was straight-forward and doesn't require too much overhead. I admit that `cypress-axe` cannot test every accessibility detail, for example focus management. However, with my static site, which at time of writing only has some blogposts, using `cypress-axe`'s `cy.checkA11y()` has already helped me find hard to notice issues such as [heading order](https://dequeuniversity.com/rules/axe/4.0/heading-order).

## The tools at play

* [Cypress](https://www.cypress.io/) is an end-to-end testing framework which allows you to run tests in the browser, as if they were clicking through your app or website. 
* [Axe-core](https://github.com/dequelabs/axe-core) brands itself as "an accessibility testing engine for websites and other HTML-based user interfaces". The engine can be accessed in several different ways including the [VSCode Accessibility Linter](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter), which will make suggestions as you write code, and the [axe DevTools](https://www.deque.com/axe/devtools/), which allows you to run audits of websites directly from your browser dev tools.
* [cypress-axe](https://github.com/component-driven/cypress-axe) is the module which allows you to inject the axe-core runtime into the page you are testing in Cypress.

## Setting it up

To avoid copy-pasting documentation which might change, I suggest you follow the documented installation steps for [`Cypress`](https://docs.cypress.io/guides/getting-started/installing-cypress) and then for [`cypress-axe`](https://github.com/component-driven/cypress-axe).

After installing, you will need to add the below line to `cypress/support/index.js`

```js
import 'cypress-axe'
```

This hooks `injectAxe()` and `checkA11y()` to the `cy` object, so that you can call those functions in your tests.

## Writing your test

Once installed, you can run the following functions in your test

```js
cy.visit('/') // or localhost:<portnumber> or whatever path you want to test
cy.injectAxe() // injects axe-core so that audit can be run on page under test
cy.checkA11y()
```

Already `checkA11y()` allows you to audit and correct issues that might be on your page. As this my personal site is quite small, I only found two issues which were [`landmark-unique`](https://dequeuniversity.com/rules/axe/4.1/landmark-unique) and [heading order](https://dequeuniversity.com/rules/axe/4.0/heading-order). However, the tool even allows you to check for unlabelled inputs, duplicate IDs and nested landmarks. See the available rules in the [Axe documentation](https://dequeuniversity.com/rules/axe/).

For more interactive sites, you might want to interact with the page first, for example, clicking on buttons to reveal other content, before running `cy.checkA11y()`.

## Github actions

To automate the process, I set up a Github action to check for every MR. You can learn how to set this up in the [Cypress Documentation on Github actions](https://docs.cypress.io/guides/continuous-integration/github-actions). You can also check out the [repo for this blog](https://github.com/lwkchan/11ty-blog) for my specific set-up, which is a static site running on [11ty](https://www.11ty.dev/).

For now I've only written the test so it checks the latest blogpost, as I don't really want the CI to run for too long and to get progressively longer as I write more posts (even though it is admittedly very short already, being a simple site). Check out that [test on my Github repo for this site](https://github.com/lwkchan/11ty-blog/blob/master/cypress/integration/a11y.test.js).

## Further resources

- [Testing Accessibility with Marcy Sutton](https://www.learnwithjason.dev/testing-accessibility). A livestream from Jason Lengstorf's Learn with Jason series. Marcy is an expert in web a11y and I highly recommend her content on the subject.
- [The most common HTML mistake that I see, by Kevin Powell](https://www.youtube.com/watch?v=NexL5_Vdoq8). This video is where I first learned that heading order is a very common issue in accessibility. Kevin audits a couple of sites, one good example and one bad example, and explains why this is an issue
