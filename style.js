const blue = '#90d0f6';

const style = {
    '.BasicModalsVeil, .BasicModalsVeilAlert, .BasicModalsVeilConfirm, .BasicModalsVeilPrompt': {
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
        transition: 'opacity 0.3s',
    },

    '.BasicModalsVeilText': {
        fontSize: '40px',
        fontFamily: 'sans-serif',
        color: 'white',
        fontWeight: 'bold',
        '-webkit-text-stroke-width': '2px',
        '-webkit-text-stroke-color': '#565656'
    },

    '.BasicModalsBox': {
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px #555',
        background: 'white',
        fontFamily: 'sans-serif',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px'
    },

    '.BasicModalsTitle': {
        textAlign: 'center',
        margin: '10px 0 20px 0',
        color: '#777'
    },

    '.BasicModalsInput': {
        display: 'block',
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

    '.BasicModalsButtonOk, .BasicModalsButtonNo': {
        background: blue,
        border: 0,
        borderRadius: '4px',
        padding: '10px 15px',
        color: '#fff',
        outline: 0,
        cursor: 'pointer',
        transition: 'background 0.2s'
    },

    '.BasicModalsButtonOk:hover, .BasicModalsButtonNo:hover': {
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
}

exports.style = style