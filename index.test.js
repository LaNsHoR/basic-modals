const { alert, prompt, confirm, veil } = require('./index')

const { document } = global

beforeEach( () => {
    document.body.innerHTML = ''
})

test('render empty alert', () => {
    const promise = alert().then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsButtonOk'))
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render alert z-index', () => {
    const promise = Promise.all([
        alert(),
        alert(),
        alert()
    ]).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    const veils = document.querySelectorAll('.BasicModalsVeilAlert')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic alert', () => {
    const message = 'hello'
    const promise = alert(message).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(message)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom alert', () => {
    const message = 'hello'
    const button_ok_content = 'bye'
    const promise = alert({message, button_ok_content}).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(message)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_ok_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test alert button is focused', () => {
    alert()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsButtonOk'))
    document.querySelector('.BasicModalsButtonOk').click()
})

test('render empty confirm', () => {
    const promise = confirm().then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render confirm z-index', () => {
    const promise = Promise.all([
        confirm(),
        confirm(),
        confirm()
    ]).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    const veils = document.querySelectorAll('.BasicModalsVeilConfirm')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic confirm', () => {
    const question = 'hello'
    const promise = confirm(question).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom confirm', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content}).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_yes_content)
    expect(document.querySelector('.BasicModalsButtonNo').innerHTML).toBe(button_no_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test confirm promise (answer: yes)', () => {
    const question = 'hello'
    const button_yes_content = 'I say YES!'
    const button_no_content = 'I say NO!'
    const promise = confirm({question, button_yes_content, button_no_content}).then( result => {
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(result).toBe(true)
    })
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
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
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(result).toBe(false)
    })
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
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
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
    })
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
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

test('render empty prompt', () => {
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle')).toBeTruthy()
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render prompt z-index', () => {
    const promise = Promise.all([
        prompt(),
        prompt(),
        prompt()
    ]).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )

    const veils = document.querySelectorAll('.BasicModalsVeilPrompt')
    expect(veils[0].style.zIndex).toBe("100")
    expect(veils[1].style.zIndex).toBe("200")
    expect(veils[2].style.zIndex).toBe("300")
    document.querySelectorAll('.BasicModalsButtonOk').forEach( button => button.click() )
    return promise
})

test('render basic prompt', () => {
    const question = 'write something'
    const promise = prompt(question).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('render custom prompt', () => {
    const question = 'write something'
    const value = 'my default'
    const placeholder = 'here something'
    const button_accept_content = 'this is ok'
    const button_cancel_content = 'this is cancel'
    const promise = prompt({question, value, placeholder, button_accept_content, button_cancel_content}).then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    expect(document.querySelector('.BasicModalsInput').value).toBe(value)
    expect(document.querySelector('.BasicModalsInput').placeholder).toBe(placeholder)
    expect(document.querySelector('.BasicModalsButtonOk').innerHTML).toBe(button_accept_content)
    expect(document.querySelector('.BasicModalsButtonCancel').innerHTML).toBe(button_cancel_content)
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test prompt promise (valid input)', () => {
    const question = 'write something'
    const response = 'my response'
    const promise = prompt(question).then( value => {
        expect(document.querySelector('.BasicModalsTitle')).toBe(null)
        expect(value).toBe(response)
    })
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsInput').value = response
    document.querySelector('.BasicModalsButtonOk').click()
    return promise
})

test('test prompt promise (cancel)', () => {
    expect.assertions(2)
    const question = 'write something'
    const promise = prompt(question).catch( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    expect(document.querySelector('.BasicModalsTitle').innerHTML).toBe(question)
    document.querySelector('.BasicModalsButtonCancel').click()
    return promise
})

test('test prompt input is focused', () => {
    prompt()
    expect(document.activeElement).toBe(document.querySelector('.BasicModalsInput'))
})

test('test prompt press enter closes the prompt', () => {
    const promise = prompt().then( _ => expect(document.querySelector('.BasicModalsTitle')).toBe(null) )
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.querySelector('.BasicModalsInput').dispatchEvent( event )
    return promise
})

test('render empty veil', () => {
    veil()
    expect(document.querySelector('.BasicModalsVeil')).toBeTruthy()
})

test('render veil with text', () => {
    const text = 'this is my test text'
    veil( { text })
    expect(document.querySelector('.BasicModalsVeilText').innerHTML).toBe(text)
})

test('veil returns close method', () => {
    const close = veil()
    expect(document.querySelector('.BasicModalsVeil')).toBeTruthy()
    return close().then( _ => expect(document.querySelector('.BasicModalsVeil')).toBe(null) )
})
