---
slug: form-validation-with-html5
date: 2019-12-06T17:08:55.740Z
title: Form validation with HTML5
intro: >-
  The browser has it's own built in form validation, yet, when reaching out to
  build a form, I tend to disregard it. Here I try it out and see how can go
  with it.
---
As a day-to-day React developer, when it comes to solving complex UI problems, such as form validation, my first instinct would be to use straight up JavaScript. Depending on the criteria, field values can be validated on the input's `onchange` event or the form's `onsubmit` event. You would store some regex and/or maximum characters. Then, when you need to validate it, you'd need to run the inputs' value properties against these.

However, I recently found that HTML's own `<input>` can take its own `pattern` attribute. This attribute takes a regex ([namely of the JavaScript flavour](https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute)) and matches the input to the pattern. The pattern of the below input looks for an input with all-capital text:

```html
<label for='scream-content'>Enter something to scream:</label>
<input id='scream-content' type='text' pattern='[A-Z]+'/>
```

Here is a codepen if you want to poke around:

<iframe height="265" style="width: 100%;" scrolling="no" title="Scream Input" src="//codepen.io/lwkchan-the-decoder/embed/preview/VwZXNYv/?height=265&theme-id=dark&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lwkchan-the-decoder/pen/VwZXNYv/'>Scream Input</a> by lw9908
  (<a href='https://codepen.io/lwkchan-the-decoder'>@lwkchan-the-decoder</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>

Here, if the user enters an invalid pattern (i.e. one with lower-case letters), the UI would to show that the input is invalid. In the above plain HTML example, different browsers would handle this differently (won't cover how, but open this Codepen in other browsers and have a look). It was easy to just add a couple extra attributes to make sure the user fills in the form correctly: `title` gives the user a description of the requested pattern; `required` makes sure the user doesn't submit the form without entering a value. The form also avoids sending the data to the server when the entire form is invalid.

And with that, we have our first taste of a fully HTML5 form complete with validation. We can verify this by disabling JavaScript when visiting that page. It still guides the user how to successfully submit the form.

But then let's say you want to streamline designs between browsers. In a real-world scenario, a company might want to fine tune their own journey with custom details.

In this case, we would reach into the HTML5 form's APIs with JavaScript. 

<iframe height="265" style="width: 100%;" scrolling="no" title="Scream Input with css" src="//codepen.io/lwkchan-the-decoder/embed/preview/KKPRRZB/?height=265&theme-id=dark&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lwkchan-the-decoder/pen/KKPRRZB/'>Scream Input with css</a> by lw9908
  (<a href='https://codepen.io/lwkchan-the-decoder'>@lwkchan-the-decoder</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the JavaScript first tell the `<form>` element that we don't need it to handle validation by giving it a `novalidate` attribute. Instead, we will manually intercept the form's `onsubmit` event with an EventListener.

I learned here that the `formElement` interface actually has some helpful methods to do with formValidation. (See them [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)) Here we'll use the `elements` method to get access to all its elements, then on each one, we check their validity with the `validity` property.

As an aside, the validity property is really powerful as it returns a whole [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of the input element. This is useful if you need to specify the error that is actually happening. E.g. whether the field is required but empty, whether the field currently has an invalid value, or even if the value is too long or too short!

Some logic is added to remove the error class if the field is actually valid and to check if a previously invalid field is still invalid (in which case, just leave it). The loop is directed to `continue` after the element is dealt with so validation can resume on the rest of the elements.

By adding the error class to the input, we can streamline designs between different browsers, for example by adding a solid red border to invalid fields, rather than just rely on the in-built browser behaviour.

What's cool about this form is that if JavaScript is disabled or fails to load, the form validation will continue to work. This is why I decided to add the novalidate attribute with JavaScript rather than directly in the HTML.

## Resources:

* [CSS Tricks article on Contraint Validation API](https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/)
* [MDN article on HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements)
* [MDN on form element Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
