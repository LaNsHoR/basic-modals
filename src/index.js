const { HTML, CSS } = require('html-css-builder')
const { style } = require('./style')

// inject the stylesheet lazily on first modal open, guarded so importing the module in a non-DOM environment
// (SSR: plain Node, Next, Remix) doesn't crash. It runs once; module caching keeps styles_injected across calls.
let styles_injected = false
function inject_styles() {
    if( styles_injected || typeof document == 'undefined' )
        return
    // wrap the defaults in a named cascade layer: lazy injection means this stylesheet lands AFTER a consumer's own
    // stylesheet, so equal-specificity overrides of .BasicModals* would otherwise lose on source order. An unlayered
    // rule always outranks a layered one, so @layer keeps the defaults overridable regardless of injection order.
    CSS( { '@layer basic-modals': style } )
    styles_injected = true
}

const defaults = {
    alert:   { message: 'Default Message', button_ok_content: 'Ok', title: null, escape: true },
    confirm: { question: 'Default Question', button_yes_content: 'Yes', button_no_content: 'No', button_cancel_content: null, title: null, escape: true },
    prompt:  { question: 'Default Question', value: '', placeholder: '', button_accept_content: 'Accept', button_cancel_content: 'Cancel', title: null, validate: null, escape: true, inputs: null },
    veil:    { content: null, escape: false }
}

const defaults_original = JSON.parse( JSON.stringify( defaults ) )

// veil is the base primitive every modal is built on: a native <dialog> opened with showModal() (browser top layer,
// native ::backdrop, focus-trap, Escape, centered) with a pure-CSS fade (see style.js). `content` is either a string
// (rendered as big centered text) or an HTMLElement inserted as-is (a box, a whole modal, anything). It returns
// { dialog, close, closed }: the dialog element, a close(value) that fades it out + removes it, and `closed`, a
// promise resolving with the dialog returnValue once it has left the DOM — whether closed via close() or Escape.
function veil( options = {} ) {
    const parameters = typeof options == 'string' ? { content: options } : options
    const { content, className, id, escape, veil_class } = { ...defaults_original.veil, ...defaults.veil, ...parameters }

    inject_styles()

    // veil_class lets the modals built on top of veil keep their own root class (BasicModalsVeilAlert/Confirm/Prompt)
    // rather than a shared BasicModalsVeil — matching the pre-2.0.0 DOM where each modal had its own veil class
    const dialog = HTML( 'dialog', { className: veil_class || 'BasicModalsVeil' }, document.body )

    // split so a multi-class string ("a b") works — classList.add() throws on tokens containing spaces
    if( className )
        dialog.classList.add( ...className.split( /\s+/ ).filter( Boolean ) )

    if( id )
        dialog.id = id

    // Escape fires the dialog 'cancel' event before closing; block it when escape is disabled
    dialog.addEventListener( 'cancel', event => {
        if( ! escape )
            event.preventDefault()
    } )

    dialog.showModal()

    if( typeof content == 'string' )
        HTML( 'div', { className: 'BasicModalsVeilText' }, dialog, content )
    else if( content )
        dialog.appendChild( content )

    const closed = new Promise( done => {
        dialog.addEventListener( 'close', () => {
            // the CSS fade-out plays via :not([open]); remove the node and resolve once it's done
            const duration = parseFloat( getComputedStyle( dialog ).transitionDuration ) * 1000 || 0
            setTimeout( () => { dialog.remove(); done( dialog.returnValue ) }, duration )
        }, { once: true } )
    } )

    const close = value => {
        dialog.close( value )
        return closed
    }

    return { dialog, close, closed }
}

// build the white box every dialog modal shows, and stamp the per-type classes on BOTH the box (BasicModals<Type>)
// and the veil root (BasicModalsVeil<Type>) so each kind can be styled independently. Returns the box + veil handles.
function build_modal( type, { title, className, id, escape } ) {
    const box = HTML( 'div', { className: `BasicModalsBox BasicModals${type}` } )
    HTML( 'div', { className: 'BasicModalsTitle' }, box, title )
    const handles = veil( { content: box, className, id, escape, veil_class: `BasicModalsVeil${type}` } )
    handles.box = box
    return handles
}

function alert( options = {} ) {
    const parameters = typeof options == 'string' ? { message: options } : options
    const { message, button_ok_content, title, className, id, escape } = { ...defaults_original.alert, ...defaults.alert, ...parameters }

    const { box, close, closed } = build_modal( 'Alert', { title, className, id, escape } )
                      HTML( 'div', { className: 'BasicModalsContent' }, box, message )
    const line      = HTML( 'div', { className: 'BasicModalsLineAlert' }, box )
    const button_ok = HTML( 'button', { className: 'BasicModalsButtonOk' }, line, button_ok_content )

    button_ok.onclick = () => close( 'ok' )
    button_ok.focus()

    // any close (button or Escape) resolves — alert has nothing to cancel
    return closed.then( () => undefined )
}

function confirm( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, button_yes_content, button_no_content, button_cancel_content, title, className, id, escape } = { ...defaults_original.confirm, ...defaults.confirm, ...parameters }

    const { box, close, closed } = build_modal( 'Confirm', { title, className, id, escape } )
                   HTML( 'div', { className: 'BasicModalsContent' }, box, question )
    const line   = HTML( 'div', { className: 'BasicModalsLineConfirm' }, box )

    if( button_cancel_content )
        HTML( 'button', { className: 'BasicModalsButtonCancel' }, line, button_cancel_content ).onclick = () => close( 'cancel' )

    HTML( 'button', { className: 'BasicModalsButtonNo' }, line, button_no_content ).onclick = () => close( 'no' )

    const button_yes = HTML( 'button', { className: 'BasicModalsButtonOk' }, line, button_yes_content )
    button_yes.onclick = () => close( 'yes' )
    button_yes.focus()

    return closed.then( value => {
        if( value == 'yes' )
            return true
        if( value == 'no' )
            return false
        // 'cancel' button, or Escape (returnValue ''): reject only when a cancel affordance exists; otherwise treat
        // the dismissal as a soft "no" so callers without a .catch don't get an unhandled rejection
        return button_cancel_content ? Promise.reject() : false
    } )
}

function prompt( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, value, placeholder, button_accept_content, button_cancel_content, title, validate, className, id, escape, inputs } = { ...defaults_original.prompt, ...defaults.prompt, ...parameters }

    const { box, close, closed } = build_modal( 'Prompt', { title, className, id, escape } )

    // fields that take part in the result + validation: { name: element-with-a-value }
    const fields = {}
    let response = null

    if( inputs ) {
        // custom inputs replace the classic question+input. Every element is rendered, but only those exposing a
        // .value join the result/validation, so non-input extras (separators, labels) can be passed through harmlessly
        const container = HTML( 'div', { className: 'BasicModalsInputs' }, box )
        Object.entries( inputs ).forEach( ([ name, element ]) => {
            container.appendChild( element )
            if( element.value !== undefined )
                fields[name] = element
        } )
    }
    else {
        HTML( 'div', { className: 'BasicModalsContent' }, box, question )
        response = HTML( 'input', { className: 'BasicModalsInput', type: 'text', id: 'PromptResponse', value, placeholder }, box )
        fields.value = response
    }

    const line          = HTML( 'div', { className: 'BasicModalsLinePrompt' }, box )
    const button_cancel = HTML( 'button', { className: 'BasicModalsButtonCancel' }, line, button_cancel_content )
    const button_accept = HTML( 'button', { className: 'BasicModalsButtonOk' }, line, button_accept_content )
    const error_message = HTML( 'div', { className: 'BasicModalsErrorMessage' }, line )

    // validate is either a single function (applied to every field) or an object { name: fn } (applied per field)
    const validate_field = ( name, field_value ) => {
        const validator = typeof validate == 'function' ? validate : validate[name]
        return validator ? validator( field_value ) : null
    }

    const run_validation = () => {
        error_message.innerHTML = ''
        let error = null
        for( const name in fields ) {
            error = validate_field( name, fields[name].value )
            if( error )
                break
        }
        if( error ) {
            error_message.innerHTML = error
            button_accept.setAttribute( 'disabled', '' )
            button_accept.classList.add( 'BasicModalsDisabled' )
            return
        }
        button_accept.removeAttribute( 'disabled' )
        button_accept.classList.remove( 'BasicModalsDisabled' )
    }

    if( validate ) {
        Object.values( fields ).forEach( element => {
            element.addEventListener( 'input', run_validation )
            element.addEventListener( 'change', run_validation )
        } )
        run_validation()
    }

    // focus the first field and let Enter on it accept
    const first = Object.values( fields )[0]
    first?.focus?.()
    if( first )
        first.onkeydown = event => { event.key == 'Enter' && button_accept.click() }

    button_accept.onclick = () => close( 'accept' )
    button_cancel.onclick = () => close( 'cancel' )

    return closed.then( value => {
        // the cancel button closes with 'cancel'; Escape closes with returnValue '' — reject with the reason so
        // callers can tell them apart. Dismissal still rejects, so consumers must attach a .catch.
        if( value != 'accept' )
            return Promise.reject( value || 'escape' )
        // with custom inputs resolve an object { name: value }; otherwise the legacy single string
        if( ! inputs )
            return response.value
        const result = {}
        for( const name in fields )
            result[name] = fields[name].value
        return result
    } )
}

exports.prompt   = prompt
exports.alert    = alert
exports.confirm  = confirm
exports.veil     = veil
exports.defaults = defaults

// expose the browser global only when there's a window (guarded so SSR / plain-Node imports don't crash)
if( typeof window !== 'undefined' )
    window.BasicModals = { prompt, alert, confirm, veil, defaults }
