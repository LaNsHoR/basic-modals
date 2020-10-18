const { alert, prompt, confirm } = require('./index')

const { document } = global

test('render empty alert', () => {
    alert()
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render basic alert', () => {
    const message = 'hello'
    alert(message)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(message)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render custom alert', () => {
    const message = 'hello'
    const button_ok_content = 'bye'
    alert({message, button_ok_content})
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('test alert promise', () => {
    const message = 'hello'
    const promise = alert(message)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(message)
    promise.then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    document.querySelector('.BasicModalsButtonOk').click()
})

test('render empty confirm', () => {
    confirm()
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render basic confirm', () => {
    const question = 'hello'
    confirm(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render custom confirm', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    confirm({question, button_yes_content, button_no_content})
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_no_content)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('test confirm promise (answer: yes)', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content})
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_no_content)
    promise.then( result => {
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(result).toBe(true)
    })
    document.querySelector('.BasicModalsButtonOk').click()
})

test('test confirm promise (answer: no)', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content})
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_no_content)
    promise.then( result => {
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(result).toBe(false)
    })
    document.querySelector('.BasicModalsButtonCancel').click()
})

test('render empty prompt', () => {
    prompt()
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render basic prompt', () => {
    const question = 'write something'
    prompt(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('render custom prompt', () => {
    const question = 'write something'
    const default_value = 'my default'
    const placeholder = 'here something'
    const button_ok_content = 'this is ok'
    const button_cancel_content = 'this is cancel'
    prompt({question, default_value, placeholder, button_ok_content, button_cancel_content})
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(default_value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    expect(document.querySelector('.BasicModalsTitle')).toBe(null)
})

test('test prompt promise (valid input)', () => {
    const question = 'write something'
    const response = 'my response'
    const promise = prompt(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    promise.then( value => {
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(value).toBe(response)
    })
    document.querySelector('.BasicModalsInput').value = response
    document.querySelector('.BasicModalsButtonOk').click()
})

test('test prompt promise (cancel)', () => {
    const question = 'write something'
    const promise = prompt(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    promise.catch( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    document.querySelector('.BasicModalsButtonCancel').click()
})
