const { alert, prompt, confirm, veil, defaults } = require('../src/index')

const { document } = global

const defaults_original = JSON.parse( JSON.stringify( defaults ) )

beforeEach( () => {
    document.body.innerHTML = ''
    // restore defaults
    for( modal in defaults )
        defaults[modal] = JSON.parse( JSON.stringify( defaults_original[modal] ) )
})

test('render empty alert', () => {
    const promise = alert().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent')).toBeTruthy()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsButtonOk'))
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert z-index', () => {
    const promise = Promise.all([
        alert(),
        alert(),
        alert()
    ]).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    const veils = document.querySelectorAll('.BasicModalsVeilAlert')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic alert', () => {
    const message = 'hello'
    const promise = alert(message).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom alert', () => {
    const message = 'hello'
    const button_ok_content = 'bye'
    const title = 'my lovely title'
    const promise = alert({message, button_ok_content, title}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(title)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test alert button is focused', () => {
    alert()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsButtonOk'))
    document.querySelector('.BasicModalsButtonOk').click()
})

test('render alert with custom default message and not content', () => {
    const message = 'new default message'
    defaults.alert.message = message
    const promise = alert().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.alert.button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert with overrode custom default message (string)', () => {
    const default_message = 'new default message'
    defaults.alert.message = default_message
    const message = 'overrode!'
    const promise = alert(message).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.alert.button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert with overrode custom default message (object)', () => {
    const default_message = 'new default message'
    defaults.alert.message = default_message
    const message = 'overrode!'
    const promise = alert({message}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.alert.button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert with custom button text and no content', () => {
    const button_ok_content = 'click here'
    defaults.alert.button_ok_content = button_ok_content
    const promise = alert().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(defaults.alert.message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert with overrode custom defaults', () => {
    const default_message = 'new default message'
    defaults.alert.message = default_message
    const default_button_ok_content = 'click here'
    defaults.alert.button_ok_content = default_button_ok_content
    const message = 'overrode!'
    const button_ok_content = 'do not click here!'
    const promise = alert({message, button_ok_content}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert with partial defaults', () => {
    const message = 'overrode!'
    defaults.alert = { message }
    const promise = alert().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.alert.button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render empty confirm', () => {
    const promise = confirm().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render confirm z-index', () => {
    const promise = Promise.all([
        confirm(),
        confirm(),
        confirm()
    ]).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    const veils = document.querySelectorAll('.BasicModalsVeilConfirm')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic confirm', () => {
    const question = 'hello'
    const promise = confirm(question).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
    expect(document.querySelector('.BasicModalsButtonCancel')).toBe(null)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom confirm', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const title = 'this has title'
    const promise = confirm({question, button_yes_content, button_no_content, title}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(button_no_content)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(title)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test confirm promise (answer: yes)', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content}).then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(true)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(button_no_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test confirm promise (answer: no)', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content}).then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(button_no_content)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('test confirm with cancel', () => {
    expect.assertions(5)
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const button_cancel_content = 'Cancel this!!'
    const promise = confirm({question, button_yes_content, button_no_content, button_cancel_content}).catch( _ => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_cancel_content)
    document.querySelector('.BasicModalsButtonCancel').click()
    return promise
})

test('test confirm ok button is focused', () => {
    confirm()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsButtonOk'))
})

test('test confirm with custom defaults', () => {
    defaults.confirm = { question: 'the default question', button_yes_content: 'yep!', button_no_content: 'nope', button_cancel_content: 'cancel me' }
    const promise = confirm().then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(defaults.confirm.question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults.confirm.button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(defaults.confirm.button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults.confirm.button_cancel_content)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('test confirm with custom question', () => {
    const question = 'what do you want to do today?'
    defaults.confirm.question = question
    const promise = confirm().then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.confirm.button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(defaults_original.confirm.button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel')).toBe(null)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('test confirm with custom overrode question (string)', () => {
    const default_question = 'what do you want to do today?'
    defaults.confirm.question = default_question
    const question = 'this one has priority'
    const promise = confirm(question).then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.confirm.button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(defaults_original.confirm.button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel')).toBe(null)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('test confirm with custom overrode question (object)', () => {
    const default_question = 'what do you want to do today?'
    defaults.confirm.question = default_question
    const question = 'this one has priority'
    const promise = confirm({question}).then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.confirm.button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(defaults_original.confirm.button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel')).toBe(null)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('test confirm with partial defaults', () => {
    const question = 'this one has priority'
    defaults.confirm = { question }
    const promise = confirm().then( result => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.confirm.button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(defaults_original.confirm.button_no_content)
    expect(document.querySelector('.BasicModalsButtonCancel')).toBe(null)
    document.querySelector('.BasicModalsButtonNo').click()
    return promise
})

test('render empty prompt', () => {
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt z-index', () => {
    const promise = Promise.all([
        prompt(),
        prompt(),
        prompt()
    ]).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )

    const veils = document.querySelectorAll('.BasicModalsVeilPrompt')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic prompt', () => {
    const question = 'write something'
    const promise = prompt(question).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom prompt', () => {
    const question = 'write something'
    const value = 'my default'
    const placeholder = 'here something'
    const button_accept_content = 'this is ok'
    const button_cancel_content = 'this is cancel'
    const title = 'a title for the prompt'
    const promise = prompt({question, value, placeholder, button_accept_content, button_cancel_content, title}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_cancel_content)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(title)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test prompt promise (valid input)', () => {
    const question = 'write something'
    const response = 'my response'
    const promise = prompt(question).then( value => {
        expect(document.querySelector('.BasicModalsContent')).toBe(null)
        expect(value).toBe(response)
    })
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    document.querySelector('.BasicModalsInput').value = response
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test prompt promise (cancel)', () => {
    expect.assertions(2)
    const question = 'write something'
    const promise = prompt(question).catch( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonCancel').click()
    return promise
})

test('test prompt input is focused', () => {
    prompt()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsInput'))
})

test('test prompt press enter closes the prompt', () => {
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.querySelector('.BasicModalsInput').dispatchEvent( event )
    return promise
})

test('render prompt with custom defaults', () => {
    defaults.prompt = { question: 'prompt question', value: 'the big value', placeholder: 'defaulted to what',  button_accept_content: 'ONE', button_cancel_content: 'BACK!!' }
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(defaults.prompt.question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(defaults.prompt.value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(defaults.prompt.placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults.prompt.button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults.prompt.button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt with custom question', () => {
    const question = 'another custom question :P'
    defaults.prompt.question = question
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(defaults_original.prompt.value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(defaults_original.prompt.placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.prompt.button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults_original.prompt.button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt with custom overrode question (string)', () => {
    const default_question = 'another custom question :P'
    defaults.prompt.question = default_question
    const question = '¿hablas español?'
    const promise = prompt(question).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(defaults_original.prompt.value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(defaults_original.prompt.placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.prompt.button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults_original.prompt.button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt with custom overrode question (object)', () => {
    const default_question = 'another custom question :P'
    defaults.prompt.question = default_question
    const question = '¿hablas español?'
    const promise = prompt({question}).then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(defaults_original.prompt.value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(defaults_original.prompt.placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.prompt.button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults_original.prompt.button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt with partial defaults', () => {
    const question = '¿hablas español?'
    defaults.prompt = { question }
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsContent')).toBe(null) )
    expect(document.querySelector('.BasicModalsContent').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(defaults_original.prompt.value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(defaults_original.prompt.placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(defaults_original.prompt.button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(defaults_original.prompt.button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt with validation function', () => {
    const validate = value => ['aa', 'bb', 'cc'].includes(value) ? `${value} is not allowed!` : ''
    prompt( { validate })
    const input = document.querySelector('.BasicModalsInput')
    const cases = ['aa', 'bb', 'cc']

    cases.forEach( value => {
        // not valid
        input.value = value
        input.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 65 }))
        expect(input.value).toBe(value)
        expect(document.querySelector('.BasicModalsErrorMessage').innerHTML).toBe(`${value} is not allowed!`)
        expect(document.querySelector('.BasicModalsButtonOk').hasAttribute('disabled')).toBe(true)
        // valid
        input.value = 'this is valid'
        input.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 65 }))
        expect(document.querySelector('.BasicModalsErrorMessage').innerHTML).toBe('')
        expect(document.querySelector('.BasicModalsButtonOk').hasAttribute('disabled')).toBe(false)
    })
})

test('render prompt with validation executed on first render (empty value)', () => {
    const validate = value => value ? '' : 'Can not be empty'
    prompt( { validate })
    const input = document.querySelector('.BasicModalsInput')

    expect(input.value).toBe('')
    expect(document.querySelector('.BasicModalsErrorMessage').innerHTML).toBe('Can not be empty')
    expect(document.querySelector('.BasicModalsButtonOk').hasAttribute('disabled')).toBe(true)
})

test('render prompt with validation executed on first render (custom value)', () => {
    const validate = value => value != 'hello' ? '' : 'Hello not allowed'
    prompt( { validate, value:'hello' })
    const input = document.querySelector('.BasicModalsInput')

    expect(input.value).toBe('hello')
    expect(document.querySelector('.BasicModalsErrorMessage').innerHTML).toBe('Hello not allowed')
    expect(document.querySelector('.BasicModalsButtonOk').hasAttribute('disabled')).toBe(true)
})

test('render empty veil', () => {
    veil()
    expect(document.querySelector('.BasicModalsVeil')).toBeTruthy()
})

test('render veil with text (string)', () => {
    const text = 'this is my test text'
    veil( text )
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('render veil with text (object)', () => {
    const text = 'this is my test text'
    veil( { text })
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('veil returns close method', () => {
    const close = veil()
    expect(document.querySelector('.BasicModalsVeil')).toBeTruthy()
    return close().then( _ => expect(document.querySelector('.BasicModalsVeil')).toBe(null) )
})

test('veil with custom default text', () => {
    const text = 'default veil text'
    defaults.veil.text = text
    veil()
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('veil with custom overrode default text (string)', () => {
    const text = 'final veil text'
    const default_text = 'default veil text'
    defaults.veil.text = default_text
    veil(text)
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('veil with custom overrode default text (object)', () => {
    const text = 'final veil text'
    const default_text = 'default veil text'
    defaults.veil.text = default_text
    veil({text})
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('render veil with partial defaults', () => {
    defaults.veil = {}
    veil()
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(defaults_original.veil.text)
})
