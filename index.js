const { HTML, CSS } = require('html-css-builder')
const { style } = require('./style')

CSS( style )

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

function alert({ message = '', button_ok_content = 'Ok' } = {}) {
    message = typeof arguments[0] == 'string' ? arguments[0] : message

    const veil          = HTML('div',    {className: 'BasicModalsVeilAlert'}, document.body )
    const container     = HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = HTML('div',    {className: 'BasicModalsTitle'}, container, message)
    const line          = HTML('div',    {className: 'BasicModalsLineAlert'}, container)
    const button_ok     = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_ok_content)

    button_ok.focus()
    fade_in( veil )

    return new Promise( resolve => {
        button_ok.onclick = () => { fade_out(veil).then( _ => resolve() ) }
    })
}

function confirm({ question = 'Question', button_yes_content = 'Yes', button_no_content = 'No' } = {}) {
    question = typeof arguments[0] == 'string' ? arguments[0] : question

    const veil       = HTML('div',    {className: 'BasicModalsVeilConfirm'}, document.body )
    const container  = HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title      = HTML('div',    {className: 'BasicModalsTitle'}, container, question)
    const line       = HTML('div',    {className: 'BasicModalsLineConfirm'}, container)
    const button_yes = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_yes_content)
    const button_no  = HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_no_content)

    button_yes.focus()
    fade_in(veil)

    return new Promise( (resolve, reject ) => {
        button_yes.onclick = () => { fade_out(veil).then( _ => resolve(true) ) }
        button_no.onclick = () => { fade_out(veil).then( _ => resolve(false) ) }
    })
}

function prompt({ question = 'Question', value = '', placeholder = '',  button_accept_content = 'Accept', button_cancel_content = 'Cancel' } = {}) {
    question = typeof arguments[0] == 'string' ? arguments[0] : question

    const veil          = HTML('div',    {className: 'BasicModalsVeilPrompt'}, document.body )
    const container     = HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = HTML('div',    {className: 'BasicModalsTitle'}, container, question)
    const response      = HTML('input',  {className: 'BasicModalsInput', type:'text', id:"PromptResponse", value, placeholder }, container)
    const line          = HTML('div',    {className: 'BasicModalsLinePrompt'}, container)
    const button_accept = HTML('button', {className: 'BasicModalsButtonOk'}, line, button_accept_content)
    const button_cancel = HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_cancel_content)

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

function veil( { text = '' } = {} ) {
    const veil = HTML('div', {className: 'BasicModalsVeil'}, document.body )
    HTML('div', { className: 'BasicModalsVeilText'}, veil, text)

    fade_in(veil)

    return () => fade_out(veil)
}

exports.prompt = prompt
exports.alert = alert
exports.confirm = confirm
exports.veil = veil

window.BasicModals = { prompt, alert, confirm, veil }
