---
slug: quick-notes-on-bem
date: 2020-04-03T14:47:27.069Z
title: Quick notes on BEM (Block Element Modifier) syntax in CSS
intro: >-
  I gave a short talk at work on BEM. Here are my notes which I based my talk on
  and shared with my colleauges
---
## What is it?

- What it's not:
  - A CSS framework (like Bulma, Bootstrap)
  - Library
- It's a _naming convention_ for classes in HTML and CSS
- Alternatives of _naming conventions_ include
  - Object Oriented CSS (OOCSS)
  - Scalable and Modular Architecture for CSS (SMACSS)
  - Atomic CSS

## How to use it

- Block: higher level component
- Element: descendent of block, relies on block
- Modifier: represents different state or version of block/element

```css
.block {
}
.block__element {
}
.block--modifier {
}
```

For example,  in JSX:
```jsx
<div
  className={`block ${isSelected ? "block--selected" : ""} ${
    warning ? "block--warning" : ""
  }`}
>
  <div className="block__element"></div>
</div>
```

### A 'real world' example:

```css
.person {
}
.person__hand {
}
.person--male {
}
.person--male__hand {
}
.person__hand--left {
}
```

### A real world example

#### Before BEM

```css
.site-search {
}
.site-search.full {
}
.site-search .field {
}
```

```html
<form class="site-search full">
  <input type="text" class="field" />
  <input type="Submit" value="Search" class="button" />
</form>
```

- Problem with above is that the `full` class and the `field` class might clash with class styles defined elsewhere

#### With BEM

```css
.site-search {
} /* Block */
.site-search__field {
} /* Element */
.site-search--full {
} /* Modifier */
```

or

```scss
.site-search {
  /* Block */
  &__field {
  } /* Element */
  &--full {
  } /* Modifier */
}
```

```html
<!-- Notice that a modified element gets both the base block class and the modifier class -->
<form class="site-search  site-search--full">
  <input type="text" class="site-search__field" />
  <input type="Submit" value="Search" class="site-search__button" />
</form>
```

## Pros and cons

- 👍 Avoids name clashing against global scope
- 👍 Clear what to name a new class
- 👍 Clear understanding of how CSS matches up with HTML - clear what modifier should go with what block
- 👍 Follows components
- 👍 Maintains flexibility in a CSS world - so we are still open to mix in personal preferences - but this is still open to lack of consistency across a team

When mixed with global styles like the below, it's flexible, but a new developer would need to know these helpers existed to use them.

```css
.noBreakText {
  white-space: nowrap;
}
.upperCase {
  text-transform: uppercase;
}
```

- 👎 Other tools out there which solve the global scope problem (CSS modules, SvelteJS, Styled Components (React specific))
- 👎 Lack of clarity on what should be an 'atomic' modifier
- 👎 Is open to unnecessary nesting - when is something a new block? When does something need a new modifier?

e.g.

```html
<div class="header">
  <div class="logo"></div>
</div>
```

or

```html
<div class="header">
  <div class="header__logo"></div>
</div>
```

## Resources

- [MindBEMding – getting your head ’round BEM syntax](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- [CSS Architecture for Modern JavaScript Applications](https://www.madebymike.com.au/writing/css-architecture-for-modern-web-applications/)
- [BEM 101](https://css-tricks.com/bem-101/)
