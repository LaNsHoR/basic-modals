# Basic-Modals

A small set of promise based HTML modals (alert, confirm, prompt).

# Install

```bash
npm install @lanshor/basic-modals
```

# Usage

## Alert

### Use 0: Import alert

```javascript
const { alert } = require('@lanshor/basic-modals')
```

### Use 1: Invoke it with a message

```javascript
alert('hello world')
```

### Use 2: Customize the button text

```javascript
alert( { message: 'hello world', button_ok_content: 'close' } )
```

### Use 3: Use it with a promise

```javascript
alert( 'Accept this' )
    .then( _ => console.log('The alert modal has been closed') )
```

### Use 4: Using the BasicModals global object in a browser's scope

```html
<script>
    BasicModals.alert('hello world')
</script>
```

## Confirm

### Use 0: Import confirm from the package

```javascript
const { confirm } = require('@lanshor/basic-modals')
```

### Use 1: Invoke it with a message, then get the response (true or false)

```javascript
confirm('is this cool?')
    .then( response => console.log(`The user said ${ response ? 'yes' : 'no' }`) )
```

### Use 2: Customize button texts

```javascript
confirm( { question: 'like notifications?', button_yes_content: 'always', button_no_content:'never' } )
    .then( response => { /* ... */ } )
```

### Use 3: Using the BasicModals global object in a browser's scope

```html
<script>
    BasicModals.confirm('do you want some pizza?')
        .then( response => { /* ... */ })
</script>
```

## Prompt

### Use 0: Import prompt from the package

```javascript
const { prompt } = require('@lanshor/basic-modals')
```

### Use 1: Invoke it with a message, then get the response (user's input)

```javascript
prompt("what's your name?")
    .then( name => console.log(`The user's name is ${name}`) )
```

### Use 2: Catch when the user closes the modal

```javascript
prompt("what's your name?")
    .then( name => console.log(`The user's name is ${name}`) )
    .catch( _ => console.warning('The user closed the modal') )
```

### Use 2: Customize button texts, add a default response and placeholder

```javascript
prompt( {
    question: "what's your name?",
    value: 'Eric',
    placeholder: 'Your name here',
    button_accept_content: 'Next',
    button_cancel_content:'Quit',
    })
    .then( response => { /* ... */ } )
```

### Use 3: Using the BasicModals global object in a browser's scope

```html
<script>
    BasicModals.prompt("what's your name?").then( response => { /* ... */ })
</script>
```

## Adding custom styles

This package will add a style tag with the modal's CSS in your head section. The classes are prefixed by `.BasicModals` and the should be self-explanatory, so you can add your own CSS selectors for those classes in your CSS and override / expand the default style.

Example:

```css
.BasicModalsButtonOk:hover: {
    background: red
}
```

The above will turn the Ok button red when the mouse cursor is over it.

Every modal box is children of a "veil" div with one of the following classes: `BasicModalsVeilAlert`, `BasicModalsVeilConfirm` and `BasicModalsVeilPrompt`. You can use this to customize the style of the different modals separately.

```css
/* this only will affect the confirm modal */
.BasicModalsVeilConfirm .BasicModalsButtonOk:hover: {
    background: red
}
```

If you need to increase the specificity of your selectors to override the default ones, just use:

```css
body .BasicModalsButtonOk:hover: {
    background: red
}
```

or some similar redundant ascendent section starting the selector.