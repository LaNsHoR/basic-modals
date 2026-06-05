const blue = '#90d0f6';

// fade for the veil and its ::backdrop: opacity is the visible animation; display + overlay use allow-discrete so the
// dialog stays rendered (and in the top layer) through the close transition. The fade-in starting state is below.
const fade = 'opacity 0.3s ease, display 0.3s allow-discrete, overlay 0.3s allow-discrete';

// every modal's root is a veil <dialog>: the standalone veil is .BasicModalsVeil, and alert/confirm/prompt each use
// their own .BasicModalsVeil<Type> (kept separate, pre-2.0.0 style, so each kind can be themed independently). The
// shared overlay rules below target all four through veils(), so authors still get one consistent overlay + backdrop.
const veil_classes = [ 'BasicModalsVeil', 'BasicModalsVeilAlert', 'BasicModalsVeilConfirm', 'BasicModalsVeilPrompt' ];
const veils = ( suffix = '' ) => veil_classes.map( veil_class => `dialog.${veil_class}${suffix}` ).join( ', ' );

const style = {
    // the base overlay: a transparent, full-screen <dialog> in the top layer that centers its content (text or a box)
    [veils()]: {
        margin: 0,
        border: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        background: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        transition: fade
    },

    [veils( '[open]' )]: {
        display: 'flex'
    },

    [veils( ':not([open])' )]: {
        opacity: 0
    },

    [veils( '::backdrop' )]: {
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: 1,
        transition: fade
    },

    [veils( ':not([open])::backdrop' )]: {
        opacity: 0
    },

    // fade-in: the state the veil + backdrop animate FROM the first time they're shown
    '@starting-style': {
        [veils( '[open]' )]: {
            opacity: 0
        },
        [veils( '[open]::backdrop' )]: {
            opacity: 0
        }
    },

    // the white card shown by alert/confirm/prompt — a child of the veil
    '.BasicModalsBox': {
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px #555',
        background: 'white',
        color: '#333',
        fontFamily: 'sans-serif',
        width: '50%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column'
    },

    '.BasicModalsVeilText': {
        fontSize: '40px',
        fontFamily: 'sans-serif',
        color: 'white',
        fontWeight: 'bold',
        '-webkit-text-stroke-width': '2px',
        '-webkit-text-stroke-color': '#565656'
    },

    '.BasicModalsTitle': {
        fontSize: '20px',
        color: '#8a8a8a',
        borderBottom: '1px solid #c5c5c5',
        padding: '10px 0 15px',
        marginBottom: '10px'
    },

    '.BasicModalsTitle:empty': {
        display: 'none'
    },

    '.BasicModalsContent': {
        textAlign: 'center',
        margin: '10px 0 20px 0',
        color: '#777'
    },

    // container wrapping custom prompt `inputs`; flex column by default, personalizable via the modal className
    '.BasicModalsInputs': {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '15px'
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

    '.BasicModalsButtonOk:not([disabled]):hover, .BasicModalsButtonNo:hover': {
        background: '#54b8f3'
    },

    '.BasicModalsButtonOk[disabled]': {
        opacity: 0.5,
        cursor: 'default'
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

    '.BasicModalsErrorMessage': {
        display: 'flex',
        alignItems: 'center',
        color: 'darkcyan'
    }
}

exports.style = style
