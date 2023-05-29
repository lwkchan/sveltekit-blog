---
date: 2023-02-16
title: 'Dynamic layouts with the `:has` pseudo class'
---

Today I came across a real-world example of using the new [`:has` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:has).

My designer colleague wanted to make a page layout with a dynamic width. This is useful because, when the table is small, the table can stay the same width as other content on different pages. However, if the table contains a lot of information, then our layout can expand so that the page has enough space to display its contents. 

The criteria I have set for this example are: 
- if the page has a table with less than 5 columns, the page container should have a max width
- if the page has a table with 5 columns or more, the page container should be 100%, spanning across its parent container

Without the habit of using `:has`, my initial response was to use JavaScript of course. As a rough sketch, I'd probably use a React Context to pass state up the tree, 

```jsx
import { useState, createContext, useContext, useEffect } from "react";

const TableWidthContext = createContext();
function Layout({ children }) {
  const [numberOfCols, setNumberOfCols] = useState(undefined);
  const style =
    numberOfCols && numberOfCols > 5
      ? {
          width: "100%"
        }
      : { maxWidth: "200px" };

  return (
    <TableWidthContext.Provider value={setNumberOfCols}>
      <div style={{ margin: "0 auto", ...style }}>{children}</div>
    </TableWidthContext.Provider>
  );
}

const Table = ({ columns }) => {
  const setNumberOfCols = useContext(TableWidthContext);
  useEffect(() => {
    setNumberOfCols(columns.length);
  }, [columns, setNumberOfCols]);
  return (
    <table>
      {columns.map(() => (
        <TableColumn />
      ))}
    </table>
  );
};

export default function App() {
  const cols = useTableCols() // Generate table columns elswhere
  return (
    <Layout>
      <Table columns={columns} />
    </Layout>
  );
}
```

But I felt above would be hard to maintain and extend. There was something about the fact that you need to jump between context and layout to understand that there was a large overall style change going on if the table had a certain number of tables. I wasn't too happy with this approach and decided to shelve it.

I remembered the article [The CSS :has() selector is way more than a “Parent Selector”](https://www.bram.us/2021/12/21/the-css-has-selector-is-way-more-than-a-parent-selector/) and recalled being so impressed that the `:has` selector could do more than check if an element contains another specific element. If you combine it with other selectors and combinators, you can create a selector which can bend to a very specific need.

In this case, I could achieve what I wanted in a few lines. This felt better because the code could be located in one singular place. It is smaller to maintain. If you don't want it, you can simply remove the `.layout` class. And finally, the table component didn't need to have any logic concerning the layout.

```css
.layout {
  margin: 0 auto;
  max-width: 600px;
}

.layout:has(table th:nth-of-type(5)) {
  max-width: 100%;
}
```

The argument passed to `:has`, `table th:nth-of-type(5)`, selects a a `th` element which is 5th among its siblings (`:nth-of-type(5)`) and is a child of a `table`. When passing this selector to `.layout:has()`, we are saying add the attributes to an element with `.layout` class and contains an element with the argument. This means that the `max-width: 100%` will only apply to the layout if there is a table which contains 5 or more `th` elements in a row, which denotes 5 or more columns in a table.

## Example codepen

Click on the 'Edit on Codepen' button and play around with it on a bigger screen. Be aware that [your browser might not support it](https://caniuse.com/css-has).

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="dyqooJB" data-user="lwkchan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/lwkchan/pen/dyqooJB">
  Dynamic layout with table</a> by Laura Chan (<a href="https://codepen.io/lwkchan">@lwkchan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## A note on support

As of writing, the `:has` pseudo selector has support on all the latest major browsers. For Firefox, support can be enabled through a feature flag. However, from my testing on v109, the support is patchy with the example above. Nonetheless, it is possible to create a good fallback experience. You can even use the `:not` pseudo-selector to inverse the above, making 100% width the default and 600px the maximum for when the layout does not have 5 columns or more.
