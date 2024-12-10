class KeyboardDevice {
    static codes = {
        "KeyA": 0x1C, "KeyB": 0x32, "KeyC": 0x21, "KeyD": 0x23, "KeyE": 0x24,
        "KeyF": 0x2B, "KeyG": 0x34, "KeyH": 0x33, "KeyI": 0x43, "KeyJ": 0x3B,
        "KeyK": 0x42, "KeyL": 0x4B, "KeyM": 0x3A, "KeyN": 0x31, "KeyO": 0x44,
        "KeyP": 0x4D, "KeyQ": 0x15, "KeyR": 0x2D, "KeyS": 0x1B, "KeyT": 0x2C,
        "KeyU": 0x3C, "KeyV": 0x2A, "KeyW": 0x1D, "KeyX": 0x22, "KeyY": 0x35,
        "KeyZ": 0x1A,
        "Digit0": 0x45, "Digit1": 0x16, "Digit2": 0x1E, "Digit3": 0x26, "Digit4": 0x25,
        "Digit5": 0x2E, "Digit6": 0x36, "Digit7": 0x3D, "Digit8": 0x3E, "Digit9": 0x46,
        "Enter": 0x5A, "Escape": 0x76, "Backspace": 0x66, "Tab": 0x0F, "Space": 0x29,
        "Minus": 0x4E, "Equal": 0x55, "BracketLeft": 0x1A, "BracketRight": 0x1B,
        "Backslash": 0x2B, "Semicolon": 0x33, "Quote": 0x34, "Comma": 0x36,
        "Period": 0x37, "Slash": 0x38, "CapsLock": 0x58, "ShiftLeft": 0x12,
        "ShiftRight": 0x59, "ControlLeft": 0x14, "ControlRight": 0x14,
        "AltLeft": 0x11, "AltRight": 0x11, "ArrowUp": 0x75,
        "ArrowDown": 0x72, "ArrowLeft": 0x6B, "ArrowRight": 0x74,
        "F1": 0x05, "F2": 0x06, "F3": 0x04, "F4": 0x0C, "F5": 0x03,
        "F6": 0x0B, "F7": 0x83, "F8": 0x0A, "F9": 0x01, "F10": 0x09,
        "F11": 0x78, "F12": 0x07, "Pause": 0x77, "Insert": 0x70, "Home": 0x6C,
        "PageUp": 0x69, "Delete": 0x71, "End": 0x69, "PageDown": 0x7A,
        "Backtick": 0x29, // Backtick key
        "MetaLeft": 0x8B,  // Left Meta key (Windows key or Command)
        "MetaRight": 0x8C // Right Meta key (Windows key or Command)
    };



    constructor() {
        this.scancode = 0

        document.addEventListener('keydown',
            (event) => {
                event.preventDefault(); // disable the keyboard
                this.scancode = event.code;
            })
        document.addEventListener('keyup',
            (event) => {
                event.preventDefault(); // disable the keyboard
                // 0xf0
                this.scancode = event.code;
            })
    }
}

const keyboardInterface = new KeyboardDevice()