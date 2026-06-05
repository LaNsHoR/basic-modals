const { HTML, CSS } = require('html-css-builder')
const { style } = require('./style')

CSS( style )

const defaults = {
    alert:   { message: 'Default Message', button_ok_content: 'Ok', title: null, escape: true },
    confirm: { question: 'Default Question', button_yes_content: 'Yes', button_no_content: 'No', button_cancel_content: null, title: null, escape: true },
    prompt:  { question: 'Default Question', value: '', placeholder: '', button_accept_content: 'Accept', button_cancel_content: 'Cancel', title: null, validate: null, escape: true, inputs: null },
    veil:    { text: '' }
}

const defaults_original = JSON.parse( JSON.stringify( defaults ) )

// The modal is a native <dialog>: showModal() puts it in the browser top layer (no z-index juggling), and gives us
// ::backdrop, focus-trap and Escape for free. Fade in/out is pure CSS (@starting-style + allow-discrete, see style.js).
function build_dialog( { className, id, escape, box_class = 'BasicModalsBox' } ) {
    const dialog = HTML( 'dialog', { className: box_class }, document.body )

    if( className )
        dialog.classList.add( className )

    if( id )
        dialog.id = id

    // Escape fires the dialog 'cancel' event before closing; block it when escape is disabled so the modal stays open
    dialog.addEventListener( 'cancel', event => {
        if( ! escape )
            event.preventDefault()
    } )

    dialog.showModal()

    return dialog
}

// Settle the promise when the dialog closes — whether a button called dialog.close(value) or Escape closed it with ''.
// Then the CSS fade-out plays (driven by :not([open])) and we remove the node once the transition is over.
function on_dialog_close( dialog, settle ) {
    dialog.addEventListener( 'close', () => {
        // the CSS fade-out plays via :not([open]); once it's done, remove the node and THEN settle — matching the old
        // fade_out-then-resolve order so a caller awaiting the promise sees the modal already gone from the DOM
        const duration = parseFloat( getComputedStyle( dialog ).transitionDuration ) * 1000 || 0
        setTimeout( () => {
            dialog.remove()
            settle( dialog.returnValue )
        }, duration )
    }, { once: true } )
}

function alert( options = {} ) {
    const parameters = typeof options == 'string' ? { message: options } : options
    const { message, button_ok_content, title, className, id, escape } = { ...defaults_original.alert, ...defaults.alert, ...parameters }

    const dialog    = build_dialog( { className, id, escape } )
                      HTML( 'div', { className: 'BasicModalsTitle' }, dialog, title )
                      HTML( 'div', { className: 'BasicModalsContent' }, dialog, message )
    const line      = HTML( 'div', { className: 'BasicModalsLineAlert' }, dialog )
    const button_ok = HTML( 'button', { className: 'BasicModalsButtonOk' }, line, button_ok_content )

    button_ok.onclick = () => dialog.close( 'ok' )
    button_ok.focus()

    // any close (button or Escape) resolves — alert has nothing to cancel
    return new Promise( resolve => on_dialog_close( dialog, () => resolve() ) )
}

function confirm( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, button_yes_content, button_no_content, button_cancel_content, title, className, id, escape } = { ...defaults_original.confirm, ...defaults.confirm, ...parameters }

    const dialog = build_dialog( { className, id, escape } )
                   HTML( 'div', { className: 'BasicModalsTitle' }, dialog, title )
                   HTML( 'div', { className: 'BasicModalsContent' }, dialog, question )
    const line   = HTML( 'div', { className: 'BasicModalsLineConfirm' }, dialog )

    if( button_cancel_content )
        HTML( 'button', { className: 'BasicModalsButtonCancel' }, line, button_cancel_content ).onclick = () => dialog.close( 'cancel' )

    HTML( 'button', { className: 'BasicModalsButtonNo' }, line, button_no_content ).onclick = () => dialog.close( 'no' )

    const button_yes = HTML( 'button', { className: 'BasicModalsButtonOk' }, line, button_yes_content )
    button_yes.onclick = () => dialog.close( 'yes' )
    button_yes.focus()

    return new Promise( ( resolve, reject ) => {
        on_dialog_close( dialog, value => {
            if( value == 'yes' )
                return resolve( true )
            if( value == 'no' )
                return resolve( false )
            // 'cancel' button, or Escape (returnValue ''): reject only when a cancel affordance exists; otherwise treat
            // the dismissal as a soft "no" so callers without a .catch don't get an unhandled rejection
            button_cancel_content ? reject() : resolve( false )
        } )
    } )
}

function prompt( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, value, placeholder, button_accept_content, button_cancel_content, title, validate, className, id, escape, inputs } = { ...defaults_original.prompt, ...defaults.prompt, ...parameters }

    const dialog = build_dialog( { className, id, escape } )
                   HTML( 'div', { className: 'BasicModalsTitle' }, dialog, title )

    // fields that take part in the result + validation: { name: element-with-a-value }
    const fields = {}
    let response = null

    if( inputs ) {
        // custom inputs replace the classic question+input. Every element is rendered, but only those exposing a
        // .value join the result/validation, so non-input extras (separators, labels) can be passed through harmlessly
        const container = HTML( 'div', { className: 'BasicModalsInputs' }, dialog )
        Object.entries( inputs ).forEach( ([ name, element ]) => {
            container.appendChild( element )
            if( element.value !== undefined )
                fields[name] = element
        } )
    }
    else {
        HTML( 'div', { className: 'BasicModalsContent' }, dialog, question )
        response = HTML( 'input', { className: 'BasicModalsInput', type: 'text', id: 'PromptResponse', value, placeholder }, dialog )
        fields.value = response
    }

    const line          = HTML( 'div', { className: 'BasicModalsLinePrompt' }, dialog )
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

    button_accept.onclick = () => dialog.close( 'accept' )
    button_cancel.onclick = () => dialog.close( 'cancel' )

    return new Promise( ( resolve, reject ) => {
        on_dialog_close( dialog, closed => {
            if( closed != 'accept' )
                return reject()
            // with custom inputs resolve an object { name: value }; otherwise the legacy single string
            if( ! inputs )
                return resolve( response.value )
            const result = {}
            for( const name in fields )
                result[name] = fields[name].value
            resolve( result )
        } )
    } )
}

function veil( options = {} ) {
    const parameters = typeof options == 'string' ? { text: options } : options
    const { text, className, id } = { ...defaults_original.veil, ...defaults.veil, ...parameters }

    // veil is a blocking full-screen overlay: no box chrome, no buttons, not escapable. Returns a close function.
    const dialog = build_dialog( { className, id, escape: false, box_class: 'BasicModalsVeil' } )
    HTML( 'div', { className: 'BasicModalsVeilText' }, dialog, text )

    return () => new Promise( done => {
        const duration = parseFloat( getComputedStyle( dialog ).transitionDuration ) * 1000 || 0
        dialog.addEventListener( 'close', () => setTimeout( () => { dialog.remove(); done() }, duration ), { once: true } )
        dialog.close()
    } )
}

exports.prompt   = prompt
exports.alert    = alert
exports.confirm  = confirm
exports.veil     = veil
exports.defaults = defaults

window.BasicModals = { prompt, alert, confirm, veil, defaults }
