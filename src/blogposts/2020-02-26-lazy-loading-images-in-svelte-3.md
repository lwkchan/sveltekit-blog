---
slug: lazy-loading-images-in-svelte
date: 2020-02-26T14:59:30.040Z
title: Lazy Loading Images in Svelte 3
intro: Using actions to access the DOM node and apply lazy loading to images
---
_If you are quickly looking for the solution, the code is at the end._

_NB: This solution does not use the modern browsers' native lazy loading API, something I overlooked when I first wrote this. Nonetheless, I think it's important to have solutions which supports most common browsers, since native lazy loading is not available yet on Safari or Samsung Internet, for instance._

To get an image to lazyLoad, these are the steps we'd need to take:
1. Have an `<img/>` tag ready for the expected image - without the src
2. Have a store where the tag can access the expected `src`
3. Set up a scroll event listener to check when the `<img/>` tag is about to appear on the page
4. Set the `<img/>` src attribute to the src that's needed.

In plain JavaScript, step 2 is often achieved by setting a data attribute on the `<img/>`; step 3 is achieved by applying a class name such as `lazy-img` or similar to set event listeners - or Intersection Observers - to the lazily loaded images on the page. (See this [Google Developers Article](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#lazy_loading_images) to see how that's done)

However, when using Svelte, rather than having function which hooks into all the lazy loaded images on the page with a query selector, we can just make a reusable image component, which can accept our expected `src`, and handle all of the lazy loading logic. Something like:

```html
<LazyImage src={'myFavouriteImage.jpg'} alt={'my favourite image'}/>
```

So as a first stab, my component looked something like this:

```html
// LazyImage.svelte

<script>
  export let src = "";
  export let alt = "";
  export let width = 0;
  export let height = 0;
  let currentSrc = "";

  function lazyLoad(node) {
    const observer = new IntersectionObserver(onIntersect, {
      // If the image gets within 50px in the Y axis, start the download.
      rootMargin: "50px 0px",
      threshold: 0.01
    });

    function onIntersect(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.setAttribute("src", src);
        }
      });
    }

    observer.observe(node);
    return {
      destroy() {
        observer && observer.unobserve(node);
      }
    };
  }
</script>

<img use:lazyLoad {alt} data-width={width} data-height={height} />
```
The use of `use:lazyLoad` was new to me. The `use:action` API calls a specified function when a node is created and when it is destroyed. The function has access to the node it is attached to, as well as an optional second argument which can be specified by the attribute property given to it on the mark up. See the [documentation on the `use:action` API for more information](https://svelte.dev/docs#use_action). This is useful for lazyLoading as it solves step 3, attaching a the lazyLoading function to an image element.

You'll see that I also applied a data-width and data-height attribute in the component. I added this because the `<img/>` somehow needs to know the size of the expected image so that the right space is left for the image, and the browser does not jump around when the image loads. However, I didn't go through with this in the end because I realised it is hard to implement styling to the `<img/>` unless we plan to use the same styling for all our lazily loaded images - this would be achieved either by putting a `<style/>` tag in LazyImage.svelte, or by using a `:global(img)` styling tag elsewhere in the application.

The lazyLoad function needs to be reusable on different `<img/>` tags, and we should let the component it lives in to decide its styling.

## The solution

The code above is not useless. We can still use the `use` API to attach lazyLoading functionality to the image element. However, we should extract the reusable part - the lazyLoad function - to a separate file.

I've also added an extra fall back for browsers which don't support the Intersection Observer API.

```js
// lazyLoad.js

function lazyLoad(node, src) {
  if (IntersectionObserver) {
    const observer = new IntersectionObserver(onIntersect, {
      // If the image gets within 50px in the Y axis, start the download.
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    function onIntersect(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.setAttribute('src', src);
        }
      });
    }

    observer.observe(node);
    return {
      destroy() {
        observer && observer.unobserve(node);
      }
    };
  } else {
    // fallback
    let lazyLoadThrottleTimeout = undefined;

    function polyfillLazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
      }

      lazyLoadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        if (node.offsetTop < window.innerHeight + scrollTop) {
          node.setAttribute('src', src);
        }
      }, 20);
    }
    document.addEventListener('scroll', polyfillLazyLoad);
    window.addEventListener('resize', polyfillLazyLoad);
    window.addEventListener('orientationChange', polyfillLazyLoad);
    return {
      destroy() {
        document.removeEventListener('scroll', polyfillLazyLoad);
        window.removeEventListener('resize', polyfillLazyLoad);
        window.removeEventListener('orientationChange', polyfillLazyLoad);
      }
    };
  }
}

export default lazyLoad;

```

In the above code, we now need to pass the `src` in as a parameter. Where in `LazyImage.svelte` the function had access to `src` because it was defined in the same scope, now the block no longer has access to it. 


Then, when a component in our application requires lazyLoading, we import the function into the `.svelte` file. To use it, we attach the function to the `<img/>` node with `use:lazyLoad`, then we pass in the required `src` attribute by passing it in as a value of that attribute. I.e. `use:lazyLoad={src}` 

```html
<!-- ComponentWithImage.svelte -->
<script>
  import lazyLoad from "./lazyLoad";
  const urlBase = "https://placekitten.com/g/500/500?image=";
  let imageSrcs = ["01", "02", "03", "04", "05"].map(num => urlBase + num);
</script>

<style>
  main {
    width: 400px;
    margin: 0 auto;
  }

  img {
    margin-bottom: 10px;
    width: 100%;
    display: block;
    height: 500px;
  }
</style>
<main>
  {#each imageSrcs as src, i}
    <img use:lazyLoad={src} alt="kitten number{i}" />
  {/each}
</main>
```
