# sanity-extra

Extra APIs for Sanity.io.

- [Installation](#installation)
- [Components](#components)
  - [`<DocumentFormProvider />`](#documentformprovider-)
  - [`<DocumentEditorProvider />`](#documenteditorprovider-)
  - [`<SelectedInput />`](#selectedinput-)
- [Hooks](#hooks)
  - [`useDocumentForm()`](#usedocumentform)
  - [`useDocumentState()`](#usedocumentstate)
  - [`useDocumentValue()`](#usedocumentvalue)
  - [`useDocumentList()`](#usedocumentlistprops)
  - [`useMiddlewareComponent()`](#usemiddlewarecomponentprops)
  - [`useResolveDefaultComponent()`](#useresolvedefaultcomponentprops)
- [Functions](#functions)
  - [`findField()`](#findfield)
  - [`getQueryResults()`](#getqueryresults)
  - [`isDescendantOfType()`](#isdescendantoftype)
  - [`isFieldMember()`](#isfieldmember)
  - [`isMemberObject()`](#ismemberobject)
- [Variables](#variables)
  - [`EMPTY_RECORD`](#empty_record)
- [License](#license)

## Installation

```sh
npm install sanity-extra
```

## Components

### `<DocumentFormProvider />`

_TODO: documentation & examples_

### `<DocumentEditorProvider />`

_TODO: documentation & examples_

### `<SelectedInput />`

_TODO: documentation & examples_

## Hooks

### `useDocumentForm()`

_TODO: documentation & examples_

### `useDocumentState()`

_TODO: documentation & examples_

### `useDocumentValue()`

_TODO: documentation & examples_

### `useDocumentList()`

#### Props

- `defaultOrdering: SortOrderBy[]`
- `filter: string`
- `params: Record<string, unknown>`
- `sortOrder?: SortOrder`
- `apiVersion?: string`

Example:

```ts
import {useDocumentList} from 'sanity-extra'

const list = useDocumentList({
  filter: `*[_type == 'post']`,
})
```

### `useMiddlewareComponent()`

_TODO: documentation & examples_

### `useResolveDefaultComponent()`

_TODO: documentation & examples_

## Functions

### `findField()`

_TODO: documentation & examples_

### `getQueryResults()`

_TODO: documentation & examples_

### `isDescendantOfType()`

_TODO: documentation & examples_

### `isFieldMember()`

_TODO: documentation & examples_

### `isMemberObject()`

_TODO: documentation & examples_

## Variables

### `EMPTY_RECORD`

An empty record. This is useful when optimizing React components.

## License

[MIT](LICENSE) © Marius Lundgård
