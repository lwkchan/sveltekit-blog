---
date: 2021-01-04T18:06:13.227Z
title: 'React Server Components '
intro: >-
  The year that was 2020 ends with an interesting React announcement. These are
  my not so hot takes
---
Just before Christmas 2020, the React team made public their research on [zero-bundle-size React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html). For now, nothing new has been introduced to the React API. So you shouldn't be thinking "Dammit, another thing to learn." It feels like the React team still needs to do more research and development before calling server components production ready. However, if you are interested in the future of React or even of UI development, I highly recommend watching the [announcement video](https://youtu.be/TQQPAU21ZUw) and/or reading [the RFC](https://github.com/reactjs/rfcs/pull/188). 

To me, the announcement is exciting for a couple reasons: firstly, it aims to improve user experience by reducing the number of requests to the server; secondly, it offers more control around bundle size and code-splitting.

## On data-fetching

I've always found the marriage between data-fetching and React difficult. This is effectively explained under the ["No Client-Server Waterfalls"](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#no-client-server-waterfalls) header of the RFC. App experience suffers when the client has to make multiple round trips to the server to render a component. This problem is exacerbated when API responses trigger the rendering of deeper child components, which in turn could trigger new requests as they are rendered. The framework doesn't know every single request that needs to be made to render a screen ahead of time.

Server Components allow developers to move this 'waterfall' of sequential requests to the server. We do this by making the parent component into a server component (with the file extension `.server.js`). This tells React to move component-rendering to the server, moving all potential data-fetching round trips to the server. And when component rendering on the server is finished, the component is sent in one response to the client.

This should make our app quicker, because all the client will need to do is make the one request to the server to render a new component, and the server will give the client only what it needs to render it.

In a similar vein, in the past, I've found it difficult to explain to new React developers that you need to handle the _lack_ of data as well as the presence of data, otherwise, the app will crash. I once joined where all the dynamic content was handled like this:

```jsx
function Profile ({dob, name, age}) {
  return <div>
    <p>My name is: {name ? name : ''}</p>
    <p>My dob is: {dob ? dob : ''}</p>
    <p>My age is: {age ? age : ''}</p>
  </div>
}
```

More clearly, and perhaps more pleasing to the eye would have been to do the switch logic in the parent, something like:

```jsx
function ProfileDisplay() {
  const [profileData, setProfileData] = setState(undefined);

  useEffect(() => {
    fetchProfileData().then((data) => {
      setProfileData(data)
    })
  })


  return profileData ? <Profile name={profileData.name} dob={profileData.dob} age={profileData.age}/> : null
}
```

Let's say we make ProfileDisplay a server component. Firstly, we would need to move `useEffect` and `useState` out, because server components cannot use it (See [Capabilities & Constraints of Server and Client Components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components)). To get the data, we instead could use the `react-fetch` library:

```jsx
function ProfileDisplay({id}) {
  const profileData = fetch(`/api/profile/${id}`).json() // using react-fetch, the new React IO library 
  return profileData ? <Profile name={profileData.name} dob={profileData.dob} age={profileData.age}/> : null // handle lack of Profile data as if it's non-existant, rather than in a loading state
}
```

_NB - I can't say for certain whether this is how you would use `react-fetch`, I couldn't find any examples other than the one in the_ [_demo video_](https://youtu.be/TQQPAU21ZUw?t=2315)_._

Now that the content for the ProfileData is static, we won't fall into a situation where we need to write switch statements to handle waiting for data and solely to prevent the app from crashing. With this model, we would rather write these switch statements or to handle that we don't have that data to present to the user.

## On code-splitting

With code-splitting, the client only downloads what it needs to display to the user; you receive the code you need (at least, according to the developer). A single page app (SPA) can increase the number of features without developers realising its huge bundle size increase.

When work on code-splitting starts, I might reach for `React.lazy` and dynamic importing and start splitting at a route by route level. However, I've never been a huge fan of this approach.

Firstly, it's another part of the API that people would need to learn and apply. For beginners, code-splitting can be a confusing concept; there's not visual change on the browser and you have to go into deep developer tools land to find out the differences that have been made. Moreover, as described in the [RFC](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#automatic-code-splitting), "developers have to remember to do it at all, replacing regular import statements with React.lazy and dynamic imports". 

Secondly, lazy loading components only shifts the burden from one place to another, rather than eliminating the whole burden in the first place. We get smaller bundle sizes with React.lazy, however in return we still need to _wait_ for the component code to come back from the server before rendering.

React Server Components aims to solve the code-splitting problem with the file extensions for the components. The server will treat `.client.js` files as potential points for code splitting. The example from the [RFC](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#automatic-code-splitting) explains it clearly:

```jsx
// PhotoRenderer.server.js - Server Component

import React from 'react';

// one of these will start loading *once rendered and streamed to the client*:
import OldPhotoRenderer from './OldPhotoRenderer.client.js';
import NewPhotoRenderer from './NewPhotoRenderer.client.js';

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />;
  } else {
    return <OldPhotoRenderer {...props} />;
  }
}
```

If the `FeatureFlags.useNewPhotoRenderer` is true, the `else` block is never run. So the 'OldPhotoRenderer.client.js' is never streamed to the client needlessly.

I'm not sure if the imported files ending in `.server.js` or in `.js` would also be considered as 'code splitting' points. Presumably, with these files, the server will continue rendering until the final component is created, only sending the final component to the client. I still have other outlying questions like this, but for now, it's cool to see that the React team thinks that more can be done to improve the codesplitting experience for both the user and the developer.

## Is it hard to learn

As with any new API, developers will need to learn it if they want to use it. I think the React team has been very cautious about this. For example, Server Components will be completely [opt-in](https://youtu.be/TQQPAU21ZUw?t=2906); you'll still be able to build a React app as you do currently without Server Components.

However, if you do want to become adept at Server Components, you won't need to learn any new APIs as such, but only the new file extensions and the rules you would need to adhere to to make valid Server Components. But what I find really awesome is that we don't really need to memorise every single rule. By looking at the file extensions, these new rules can be applied on our IDEs or CIs through linting.

## Some hesitations

As with any RFC, I'm always thinking "Wow this new API is amazing", until I read the comments. These are constantly changing since the RFC thread is a living document. But so far, the below are some of the ones that stuck out:

* that working Server Components might require users of SSR to filter through [three different kinds of components](https://github.com/reactjs/rfcs/pull/188#issuecomment-749188181) to find bugs. The NextJS team has made a [small demo](https://github.com/vercel/next-server-components) to demonstrate how Server Components could work with their framework, and it might have a few hints
* how [client-side authentication](https://github.com/reactjs/rfcs/pull/188#issuecomment-749332799) can work with Server Components
* [it's unclear how much infrastructure work will be required to scale up Server Components](https://github.com/reactjs/rfcs/pull/188#issuecomment-749369119). With Server Components, you would need to further maintain a server which can render the components for the client and make requests to other APIs
* [whether the seemingly 'synchronous' looks of the React IO libraries will be a detriment to the mental model](https://github.com/reactjs/rfcs/pull/188#issuecomment-749188181). One gripe is the fact that if there is no value in the cache, a Promise is thrown, caught and resolved to its value, stored in the cache, and then re-run the React component. However, Dan from the React team has said that [another RFC will be written to explain the pattern](https://github.com/reactjs/rfcs/pull/188#issuecomment-753502950)
