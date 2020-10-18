const builder = require('html-builder')

const blue = '#90d0f6';

builder.CSS( {
    '.BasicModalsVeil': {
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.5s'
    },

    '.BasicModalsBox': {
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px #555',
        background: 'white',
        fontFamily: 'sans-serif',
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
    },

    '.BasicModalsTitle': {
        textAlign: 'center',
        margin: '10px 0 20px 0',
        color: '#777'
    },

    '.BasicModalsInput': {
        display: 'block',
        width: '100%',
        marginBottom: '15px',
        borderRadius: '2px',
        border: `1px solid ${blue}`,
        color: '#333',
        padding: '5px 8px',
        outline: 0
    },

    '.BasicModalsLineAlert': {
        display: 'flex',
        justifyContent: 'center'
    },

    '.BasicModalsLineConfirm': {
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row-reverse'
    },

    '.BasicModalsLinePrompt': {
        display: 'flex',
        flexDirection: 'row-reverse'
    },

    '.BasicModalsLinePrompt > *': {
        marginLeft: '10px',
    },

    '.BasicModalsButtonOk': {
        background: blue,
        border: 0,
        borderRadius: '4px',
        padding: '10px 15px',
        color: '#fff',
        outline: 0,
        cursor: 'pointer',
        transition: 'background 0.2s'
    },

    '.BasicModalsButtonOk:hover': {
        background: '#54b8f3'
    },

    '.BasicModalsButtonCancel': {
        background: '#aaa',
        border: 0,
        borderRadius: '4px',
        padding: '10px 15px',
        color: '#fff',
        outline: 0,
        cursor: 'pointer',
        transition: 'background 0.2s'
    },

    '.BasicModalsButtonCancel:hover': {
        background: '#777'
    },
})

function prompt({ question = 'Question', default_value = '', placeholder = '',  button_ok_content = 'Accept', button_cancel_content = 'Cancel' } = {}) {
    const veil          = builder.HTML('div',    {className: 'BasicModalsVeil'}, document.body )
    const container     = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = builder.HTML('div',    {className: 'BasicModalsTitle'}, container)
    const response      = builder.HTML('input',  {className: 'BasicModalsInput', type:'text', id:"PromptResponse"}, container)
    const line          = builder.HTML('div',    {className: 'BasicModalsLinePrompt'}, container)
    const button_ok     = builder.HTML('button', {className: 'BasicModalsButtonOk' }, line)
    const button_cancel = builder.HTML('button', {className: 'BasicModalsButtonCancel'}, line)

    title.innerHTML = typeof arguments[0] == 'string' ? arguments[0] : question
    response.value = default_value
    response.placeholder = placeholder
    button_cancel.innerHTML = button_cancel_content
    button_ok.innerHTML = button_ok_content
    veil.style.opacity = 1
    response.focus()

    return new Promise( (resolve, reject ) => {
        button_ok.onclick = () => {
            veil.remove()
            resolve(response.value)
        }
        button_cancel.onclick = () => {
            veil.remove()
            reject()
        }
    })
}

function alert({ message = '', button_ok_content = 'Ok' } = {}) {
    const veil          = builder.HTML('div',    {className: 'BasicModalsVeil'}, document.body )
    const container     = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title         = builder.HTML('div',    {className: 'BasicModalsTitle'}, container)
    const line          = builder.HTML('div',    {className: 'BasicModalsLineAlert'}, container)
    const button_ok     = builder.HTML('button', {className: 'BasicModalsButtonOk' }, line)

    title.innerHTML = typeof arguments[0] == 'string' ? arguments[0] : message
    button_ok.innerHTML = button_ok_content
    veil.style.opacity = 1

    return new Promise( resolve => button_ok.onclick = () => { veil.remove(); resolve() })
}

function confirm({ question = 'Question', button_yes_content = 'Yes', button_no_content = 'No' } = {}) {
    const veil       = builder.HTML('div',    {className: 'BasicModalsVeil'}, document.body )
    const container  = builder.HTML('div',    {className: 'BasicModalsBox'}, veil)
    const title      = builder.HTML('div',    {className: 'BasicModalsTitle'}, container)
    const line       = builder.HTML('div',    {className: 'BasicModalsLineConfirm'}, container)
    const button_yes = builder.HTML('button', {className: 'BasicModalsButtonOk' }, line)
    const button_no  = builder.HTML('button', {className: 'BasicModalsButtonCancel'}, line)

    title.innerHTML = typeof arguments[0] == 'string' ? arguments[0] : question
    button_no.innerHTML = button_no_content
    button_yes.innerHTML = button_yes_content
    veil.style.opacity = 1

    return new Promise( (resolve, reject ) => {
        button_yes.onclick = () => { veil.remove(); resolve(true) }
        button_no.onclick = () => { veil.remove(); resolve(false) }
    })
}

exports.prompt = prompt
exports.alert = alert
exports.confirm = confirm

window.BasicModals = {
    prompt,
    alert,
    confirm
}
