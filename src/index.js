const { HTML, CSS } = require('html-css-builder')
const { style } = require('./style')

CSS( style )

const defaults = {
    alert: { message: 'Default Message', button_ok_content: 'Ok', title:null },
    confirm: { question: 'Default Question', button_yes_content: 'Yes', button_no_content: 'No', button_cancel_content: null, title:null },
    prompt: { question: 'Default Question', value: '', placeholder: '',  button_accept_content: 'Accept', button_cancel_content: 'Cancel', title:null, validate:null },
    veil: { text:'' }
}

const defaults_original = JSON.parse( JSON.stringify( defaults ) )

const max_z_index = () => {
    const z_indexes = [...document.querySelectorAll('body *')].map(element => parseFloat(getComputedStyle(element).zIndex) || 0)
    return Math.max.apply(null, z_indexes)
}

const fade_in = veil => {
    setTimeout( () => {
        veil.style.opacity = 1
    }, 1)
    veil.style.zIndex = max_z_index()+100
}

const fade_out = veil => (new Promise( done => {
    // we use a timeout instead a transitionend event to allow tests to work properly
    const transition_duration = parseFloat(getComputedStyle(veil)['transitionDuration'])
    setTimeout( () => {
        veil.remove()
        done()
    }, transition_duration * 1000 )
    veil.style.opacity = 0
}))

function alert( options = {} ) {
    const parameters = typeof options == 'string' ? { message: options } : options
    const { message, button_ok_content, title } = { ...defaults_original.alert, ...defaults.alert, ...parameters }

    const veil          = HTML('div',    {className: 'BasicModalsVeilAlert'}, document.body )
    const container     = HTML('div',    {className: 'BasicModalsBox'}, veil)
    title && HTML('div', {className: 'BasicModalsTitle'}, container, title)
    const content       = HTML('div',    {className: 'BasicModalsContent'}, container, message)
    const line          = HTML('div',    {className: 'BasicModalsLineAlert'}, container)
    const button_ok     = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_ok_content)

    button_ok.focus()
    fade_in( veil )

    return new Promise( resolve => {
        button_ok.onclick = () => { fade_out(veil).then( _ => resolve() ) }
    })
}

function confirm( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, button_yes_content, button_no_content, button_cancel_content, title } = { ...defaults_original.confirm, ...defaults.confirm, ...parameters }

    const veil       = HTML('div',    {className: 'BasicModalsVeilConfirm'}, document.body )
    const container  = HTML('div',    {className: 'BasicModalsBox'}, veil)
    title && HTML('div', {className: 'BasicModalsTitle'}, container, title)
    const content    = HTML('div',    {className: 'BasicModalsContent'}, container, question)
    const line       = HTML('div',    {className: 'BasicModalsLineConfirm'}, container)

    let button_cancel = null
    if( button_cancel_content ) {
        button_cancel = HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_cancel_content)
    }

    const button_no  = HTML('button', {className: 'BasicModalsButtonNo'}, line, button_no_content)
    const button_yes = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_yes_content)

    button_yes.focus()
    fade_in(veil)

    return new Promise( (resolve, reject ) => {
        button_yes.onclick = () => { fade_out(veil).then( _ => resolve(true) ) }
        button_no.onclick = () => { fade_out(veil).then( _ => resolve(false) ) }
        if( button_cancel )
            button_cancel.onclick = () => { fade_out(veil).then( _ => reject() ) }
    })
}

function prompt( options = {} ) {
    const parameters = typeof options == 'string' ? { question: options } : options
    const { question, value, placeholder, button_accept_content, button_cancel_content, title, validate } = { ...defaults_original.prompt, ...defaults.prompt, ...parameters }

    const veil          = HTML('div',    {className: 'BasicModalsVeilPrompt'}, document.body )
    const container     = HTML('div',    {className: 'BasicModalsBox'}, veil)
    title && HTML('div', {className: 'BasicModalsTitle'}, container, title)
    const content       = HTML('div',    {className: 'BasicModalsContent'}, container, question)
    const response      = HTML('input',  {className: 'BasicModalsInput', type:'text', id:"PromptResponse", value, placeholder }, container)
    const line          = HTML('div',    {className: 'BasicModalsLinePrompt'}, container)
    const button_cancel = HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_cancel_content)
    const button_accept = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_accept_content)
    const error_message = HTML('div',    {className: 'BasicModalsErrorMessage'}, line )

    // validation
    const keyup = () => {
        const error = validate( response.value )
        error_message.innerHTML = ''

        if( ! error )
            return button_accept.removeAttribute('disabled')

        error_message.innerHTML = error
        button_accept.setAttribute('disabled', '')
        button_accept.classList.add('BasicModalsDisabled')
    }

    validate && response.addEventListener('keyup', keyup)

    fade_in(veil)

    response.focus()
    response.onkeydown = event => {
        event.key == 'Enter' && button_accept.click()
    }

    return new Promise( (resolve, reject ) => {
        button_accept.onclick = () => fade_out(veil).then( _ => resolve(response.value))
        button_cancel.onclick = () => fade_out(veil).then( _ => reject())
    })
}

function veil( options = {} ) {
    const parameters = typeof options == 'string' ? { text: options } : options
    const { text } = { ...defaults_original.veil, ...defaults.veil, ...parameters }

    const veil = HTML('div', {className: 'BasicModalsVeil'}, document.body )
    HTML('div', { className: 'BasicModalsVeilText'}, veil, text)

    fade_in(veil)

    return () => fade_out(veil)
}

exports.prompt   = prompt
exports.alert    = alert
exports.confirm  = confirm
exports.veil     = veil
exports.defaults = defaults

window.BasicModals = { prompt, alert, confirm, veil, defaults }
