const builder = require('@lanshor/html-builder')
const { style } = require('./style')

builder.CSS( style )

const max_z_index = () => {
    const z_indexes = [...document.querySelectorAll('body *')].map(element => parseFloat(getComputedStyle(element).zIndex) || 0)
    return Math.max.apply(null, z_indexes)
}

function alert({ message = '', button_ok_content = 'Ok' } = {}) {
    message = typeof arguments[0] == 'string' ? arguments[0] : message

    const veil          = builder.HTML('div',    {className: 'BasicModalsVeilAlert'}, document.body )
    const container     = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = builder.HTML('div',    {className: 'BasicModalsTitle'}, container, message)
    const line          = builder.HTML('div',    {className: 'BasicModalsLineAlert'}, container)
    const button_ok     = builder.HTML('button', {className: 'BasicModalsButtonOk'}, line, button_ok_content)

    veil.style.opacity = 1
    veil.style.zIndex = max_z_index()+100

    return new Promise( resolve => button_ok.onclick = () => { veil.remove(); resolve() })
}

function confirm({ question = 'Question', button_yes_content = 'Yes', button_no_content = 'No' } = {}) {
    question = typeof arguments[0] == 'string' ? arguments[0] : question

    const veil       = builder.HTML('div',    {className: 'BasicModalsVeilConfirm'}, document.body )
    const container  = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title      = builder.HTML('div',    {className: 'BasicModalsTitle'}, container, question)
    const line       = builder.HTML('div',    {className: 'BasicModalsLineConfirm'}, container)
    const button_yes = builder.HTML('button', {className: 'BasicModalsButtonOk'}, line, button_yes_content)
    const button_no  = builder.HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_no_content)

    veil.style.opacity = 1
    veil.style.zIndex = max_z_index()+100

    return new Promise( (resolve, reject ) => {
        button_yes.onclick = () => { veil.remove(); resolve(true) }
        button_no.onclick = () => { veil.remove(); resolve(false) }
    })
}

function prompt({ question = 'Question', value = '', placeholder = '',  button_accept_content = 'Accept', button_cancel_content = 'Cancel' } = {}) {
    question = typeof arguments[0] == 'string' ? arguments[0] : question

    const veil          = builder.HTML('div',    {className: 'BasicModalsVeilPrompt'}, document.body )
    const container     = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = builder.HTML('div',    {className: 'BasicModalsTitle'}, container, question)
    const response      = builder.HTML('input',  {className: 'BasicModalsInput', type:'text', id:"PromptResponse", value, placeholder }, container)
    const line          = builder.HTML('div',    {className: 'BasicModalsLinePrompt'}, container)
    const button_accept = builder.HTML('button', {className: 'BasicModalsButtonOk'}, line, button_accept_content)
    const button_cancel = builder.HTML('button', {className: 'BasicModalsButtonCancel'}, line, button_cancel_content)

    veil.style.opacity = 1
    veil.style.zIndex = max_z_index()+100
    response.focus()

    return new Promise( (resolve, reject ) => {
        button_accept.onclick = () => {
            veil.remove()
            resolve(response.value)
        }
        button_cancel.onclick = () => {
            veil.remove()
            reject()
        }
    })
}

exports.prompt = prompt
exports.alert = alert
exports.confirm = confirm

window.BasicModals = { prompt, alert, confirm }
