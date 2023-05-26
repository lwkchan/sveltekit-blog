---
date: 2020-10-13T15:43:51.869Z
title: >-
  Testing and mocking render props or children-as-function in React and
  TypeScript
intro: >-
  Why mocking React components is useful. How to type mocks in tests when using
  TypeScript.
---
Mocking components in Jest tests is useful because if, say, Component A has been unit tested already, you don't need to test Component A again when it is being used as part of Component B.

## The real-world example

For a more concrete example consider my recent experience with modals. Our work project has many modals with different contents and slightly different styles. But as they are all modals, they have a lot of shared functionality: they share the same styling for the backdrop and pop out element that appear on the top of the content stack; they have the same style and functionality on the close (X) button; clicking on the backdrop has the same functionality.

As such, I created a `<BaseModal/>` to share these features easily. The `BaseModal` has all of the features that I described above. Below is a simplified version of this component. We used the ReactContext API to drive the Modal state. When we want to close the modal, we pass `undefined` to that ModalContext value function.

```tsx

interface Props {
  children: ReactNode;
}

function BaseModal ({children}: Props) {
  const setModalContent = useContext(ModalContext)
  <div className="baseModal">
    <CloseIcon onClick={() => setModalContent(undefined)}/>
    {children}
  </div>
}
```

Then to create a new modal, we wrap the new modal component in `<BaseModal/>` to get access to the correct the closing and styling functionality.

```tsx
interface Props {
  name: string
}

function WelcomeModal({ name }: Props) {
  return (
    <BaseModal>
      <p>Hello {name} welcome to your new account!</p>
    </BaseModal>
  )
}
```

## Testing the components with mocks

When testing BaseModal, I'd test the following: check that the ModalContext is called with useContext; check that, when the CloseIcon is clicked that the function from useContext is called with `undefined`; use a snapshot test to test that any children passed in are correctly and that any other DOM implementations such as `classNames` and `div`s are positioned correctly.

```tsx
jest.mock("react", () => {
  return { ...jest.requireActual("react"), useContext: jest.fn() }
})

const mockSetModal = jest.fn()
;(React.useContext as jest.Mock).mockReturnValue(mockSetModal)

describe("BaseModal Component", () => {
  beforeEach(() => {
    mockSetModal.mockClear()
  })
  it("matches the snapshot", () => {
    const { getByText, container, queryByTestId } = render(
      <BaseModal>
        <div>My content</div>
      </BaseModal>
    )

    expect(container).toMatchSnapshot()
  })

  it("when close is clicked, setModal is called with undefined", () => {
    const { getByText, queryByTestId, container } = renderWithIntl(
      <BaseModal showTopCloseButton={false}>
        <div>My content</div>
      </BaseModal>
    )

    fireEvent.click(queryByTestId("button.closeModal") as HTMLElement)
    expect(mockSetModal).toHaveBeenCalledWith(undefined)
  })
})
```

When it comes to testing modals which use `BaseModal` as a wrapper (e.g. the example `WelcomeModal`), we don't need to test the functionalities already given to it by `BaseModal`. We should be test anything new that `WelcomeModal` brings. In this case, it would be `WelcomeModal`'s ability to render text depending on the `name` prop.

Our tests should focus on what's new because we already have a test which tests everything that `BaseModal` gives us. Testing any functionality of `BaseModal` again would make the codebase less flexible; if we one day had to refactor `BaseModal`, whether that be changing the positioning of the close button or changing the way we manage modal display state, we won't have to change every single modal which relies on it.

So the test for `WelcomeModal` would look something like

```tsx
// mock using appropriate path to BaseModal
jest.mock("../BaseModal/BaseModal", () => {
  return function MockModal({ children }: { children: ReactNode }) {
    return <mock-base-modal>{children}</mock-base-modal>
  }
})

describe("WelcomeModal Component", () => {
  it("matches the snapshot", () => {
    const { container } = render(<WelcomeModal name="jerry" />)

    expect(container).toMatchSnapshot()
  })
})
```

By mocking `BaseModal` with `jest.mock`, when the BaseModal is printed in the snapshot, it will look something like

```html
<mock-base-modal>
  <p>Hello jerry welcome to your new account!</p>
</mock-base-modal>
```

The `<mock-base-modal/>` in our snapshot is a placeholder for the `BaseModal`. If `BaseModal` were to change, we would not have to update this snapshot because of the mock. Here, we only care that BaseModal is being used as part of the component, not about the behavior that BaseModal gives it, because this has already been tested.

## Extending the mock even further

Later on, we wanted to add the ability for the internal content of the modal to close the modal itself. For example, if there was a cancel button in the modal, we'd want clicking the cancel button to close the modal as well. When I saw this, I immediately thought to pass down an onClose function through a render prop (aka children as function). `BaseModal` was extended to look something like this:

```tsx
interface Props {
  children: ReactNode | ((handleClose: () => void) => ReactNode)
}

function BaseModal({ children }: Props) {
  const setModalContent = useContext(ModalContext)
  const closeModal = () => setModalContent(undefined)

  return (
    <div className="baseModal">
      <CloseIcon onClick={closeModal} />
      {typeof children === "function" ? children(closeModal) : children}
    </div>
  )
}
```

To test this new functionality, we'd want to make sure that when children is a function, the argument that is passed to it is equivalent to `closeModal`, or even, it is equivalent to `() => setModalContent(undefined)`. This is how I ended up doing:

```tsx
it("when children is a function, it returns the children and passes", () => {
  const mockChildren = jest.fn()
  renderWithIntl(<BaseModal>{mockChildren}</BaseModal>)

  expect(mockChildren).toHaveBeenCalled()

  const mockChildrenParams = mockChildren.mock.calls[0]
  expect(mockChildrenParams[0]).toEqual(expect.any(Function))

  // verify that it has not been called yet, so we are clear that the following invoked function is really mockSetModal
  expect(mockSetModal).not.toHaveBeenCalled()
  // invoke the param passed to the children
  mockChildrenParams[0]()
  expect(mockSetModal).toHaveBeenCalledWith(undefined)
})
```

What struck me here is that we are isolating the `BaseModal` component from the implementation of the children prop. We don't need to care _how_ the children prop is implemented, what it returns or what calculations it might make. Rather, we only care about the fact that it's a function type, it's called, and that the parameter we pass through to it is a function that closes the Modal.

Continuing with the `WelcomeModal` example, let's say we add the aforementioned cancel and close button. How would we test this? Let's try a more TDD approach this time, now that we have the outline of the tests already set up.

Firstly, we'd need to extend the BaseModal mock so that it can account for our new implementation of render children functions.

```tsx
// mock using appropriate path to BaseModal
jest.mock("../BaseModal/BaseModal", () => {
  return function MockModal({ children }: { children: ReactNode }) {
    const mockModalOnClose = jest.fn()

    return (
      <mock-base-modal>
        {typeof children === "function" ? children(mockModalOnClose) : children}
      </mock-base-modal>
    )
  }
})
```

By changing our mock to this, the test will be able to render the children as function properly. However, I would still feel more comfortable if the functionality of the cancel button is tested: that it calls the parameter passed through to the children. For this, we already have `mockModalOnClose` in our mock. So we can effectively probe and test it, we'd need to take it out of the scope of the mock factory and then we'd be able to use it in our assertions:

```tsx
const mockModalOnClose = jest.fn()

jest.mock("../BaseModal/BaseModal", () => {
  return function MockModal({ children }: { children: ReactNode }) {
    return (
      <mock-base-modal>
        {typeof children === "function" ? children(mockModalOnClose) : children}
      </mock-base-modal>
    )
  }
})

describe("WelcomeModal Component", () => {
  it("matches the snapshot", () => {
    const { container } = render(<WelcomeModal name="jerry" />)

    expect(container).toMatchSnapshot() // snapshot should update with the new button
  })

  it("when the cancel button is clicked, mockCloseModal is called", () => {
    const { getByText } = render(<WelcomeModal name="jerry" />)

    fireEvent.click(getByText("Cancel"))

    expect(mockModalOnClose).toHaveBeenCalled()
  })
})
```

With these tests, the new feature would look something like:

```tsx
interface Props {
  name: string
}

function WelcomeModal({ name }: Props) {
  return (
    <BaseModal>
      {closeModal => (
        <>
          <p>Hello {name} welcome to your new account!</p>
          <button onClick={closeModal} type="button">
            Cancel
          </button>
        </>
      )}
    </BaseModal>
  )
}
```

## Using and typing Manual Mocks in the `__mocks__` directory

Because we are going to be using `BaseModal` for many different kinds of modals, it would be useful to create a [manual mock](https://jestjs.io/docs/en/es6-class-mocks#manual-mock) for the component. Doing this means that we do not have to repeat the implementation across multiple tests. All we'd need to do is call `jest.mock('path/to/BaseModal')` in every test suite that we need to mock implementation.

In order that we can continue to probe that `mockCloseModal` is called, we also need to make sure that the function is exported from the `__mocks__/BaseModal.tsx` file. I also extended the mock a bit so we could tell when the MockModal is called with the close button or without the close button. (e.g. we'd want a close button for most modals, however we wouldn't want it for something like a cookies modal so that the user has to click 'agree with terms' to close the modal).

```tsx
// __mocks__/BaseModal.tsx

import React from "react"
import { Props } from "../BaseModal" // Get Props interface so it behaves more akin to the component

export const mockModalOnClose = jest.fn()

function MockModal({ children, showTopCloseButton = true }: Props) {
  const Component = showTopCloseButton ? "mock-modal-with-close" : "mock-modal"

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return (
    <Component>
      {typeof children === "function" ? children(mockModalOnClose) : children}
    </Component>
  )
}

export default MockModal
```

However, when I first used the above implementation, I found that exporting `mockModalOnClose` for testing was not as obvious as it seemed. Here I will detail the my attempts to get it working in TS, but scroll down to the bottom if you want the answer now.

I knew that when `jest.mock(filepath)` is called with an accompanying file in the `__mocks__` directory, Jest essentially diverts any from that file to use the mock file. So in the below example, even though the `BaseModal` file doesn't have an exported function called `mockModalOnClose`, the tests will still work because we are actually importing from `'__mocks__/BaseModal'`, which we _know_ has a mockModalOnClose function (assuming you are running the tests without a compilation step).

```tsx
import { mockModalOnClose } from "../BaseModal/BaseModal"

jest.mock("../BaseModal/BaseModal")

// further down
it("when the cancel button is clicked, mockCloseModal is called", () => {
  const { getByText } = render(<WelcomeModal name="jerry" />)

  fireEvent.click(getByText("Cancel"))
  expect(mockModalOnClose).toHaveBeenCalled()
})
```

However, with the above code, TypeScript will raise an error saying

```bash
Module '"../BaseModal/BaseModal"' has no exported member 'mockModalOnClose'.
```

This is correct because the file really doesn't have an exported member with that name. But because the tests are still working, even with the type error (that mockModalOnClose is really the function from `__mocks__/BaseModal`), we know that TypeScript is missing something.

In order to tell TypeScript to trust that my implementation is correct, I ended up doing this:

```tsx
import * as BaseModal from "../BaseModal/BaseModal"
import * as MockModal from "../BaseModal/__mocks__/BaseModal"

jest.mock("../BaseModal/BaseModal")
const { mockModalOnClose } = BaseModal as typeof MockModal

// further down, we can check that mockModalOnClose is called successfully
```

Using `as` tells TypeScript that the compiler should treat the value as a certain type. Here, because TypeScript is unaware of the implications of `jest.mock`, we need to manually say "Treat whatever we export from the `BaseModal` file as if it's the same type as exporting from `MockModal`".

## Resources

- [TypeScript docs on Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions)
- [The StackOverflow thread where I found my solution](https://stackoverflow.com/questions/53184529/typescript-doesnt-recognize-my-jest-mock-module)
- [Jest manual mocks documentation](https://jestjs.io/docs/en/es6-class-mocks#manual-mock)
