LCD_OUTPUT = $6000
INTERRUPT_SOURCE = $6001
KEYBOARD_INPUT = $6002

KEYBOARD_BUFFER = $0200             ; $200 - $2ff
KEYBOARD_READ_PTR = $00
KEYBOARD_WRITE_PTR = $01
KEYBOARD_FLAGS = $02

KEY_RELEASE = %0001
KEY_SHIFT = %0010

STRING_POINTER = $03


.org $8000                                  ; starting position
reset: 
    sei 
    ldx #$ff                                ; Init stack pointer
    txs

    lda #00
    sta KEYBOARD_READ_PTR
    sta KEYBOARD_WRITE_PTR
    sta KEYBOARD_FLAGS
    cli

setup:
    lda #lcd_config_instructions & $ff
    sta STRING_POINTER
    lda #$fd
    sta STRING_POINTER + 1
    jsr write_string

loop:
    sei
    jsr check_keys
    cli
    jmp loop

check_keys:
    lda KEYBOARD_READ_PTR
    cmp KEYBOARD_WRITE_PTR
    bne key_pressed
    rts

key_pressed:
    ldx KEYBOARD_READ_PTR
    inc KEYBOARD_READ_PTR

    lda KEYBOARD_BUFFER,x
    jsr lcd_write
    rts




write_string:
    ldy #00
    lda (STRING_POINTER),y
write_string_loop:
    jsr lcd_write
    iny
    lda (STRING_POINTER),y
    bne write_string_loop
    rts

lcd_write:
    pha
lcd_write_wait:
    lda LCD_OUTPUT
    bne lcd_write_wait
    pla
    sta LCD_OUTPUT
    rts


nmi:
    rti
irq:
keyboard_int:
    pha
    txa
    pha

    lda KEYBOARD_FLAGS
    and #KEY_RELEASE
    bne keyboard_int_released

    lda KEYBOARD_INPUT
    cmp #$12
    beq keyboard_int_shifted
    cmp #$59
    beq keyboard_int_shifted
    cmp #$f0
    bne keyboard_int_pressed 

    lda KEYBOARD_FLAGS
    ora #KEY_RELEASE
    sta KEYBOARD_FLAGS
    jmp keyboard_int_end


keyboard_int_released:
    lda KEYBOARD_FLAGS
    eor #KEY_RELEASE
    sta KEYBOARD_FLAGS

    lda KEYBOARD_INPUT
    cmp #$12
    beq keyboard_int_unshifted
    cmp #$59
    beq keyboard_int_unshifted
    jmp keyboard_int_end

keyboard_int_unshifted:
    lda KEYBOARD_FLAGS
    eor #KEY_SHIFT
    sta KEYBOARD_FLAGS
    jmp keyboard_int_end

keyboard_int_shifted:
    lda KEYBOARD_FLAGS
    ora #KEY_SHIFT
    sta KEYBOARD_FLAGS
    jmp keyboard_int_end

    ldx KEYBOARD_WRITE_PTR
    inc KEYBOARD_WRITE_PTR

    sta KEYBOARD_BUFFER,x

keyboard_int_pressed:
    tax

    lda KEYBOARD_FLAGS
    and #KEY_SHIFT
    bne keyboard_int_shift_letter

    lda keymap,x

keyboard_int_save:
    ldx KEYBOARD_WRITE_PTR
    inc KEYBOARD_WRITE_PTR

    sta KEYBOARD_BUFFER,x

keyboard_int_end:
    pla
    tax
    pla
    rti

keyboard_int_shift_letter:
    lda keymap_shifted,x
    jmp keyboard_int_save


.org $fd00                          ; constants
LCD_ON = %10000000
LCD_CONFIG = %10000000              ; DCBR: (D)isplay, (C)ursor, (B)linking behavior, and (R)ight text direction
LCD_TEXT_COLOR = %10010000 
LCD_CLEAR = %11111111
LCD_MOVE_CURSOR = %10100000 
LCD_SET_BACKGROUND_R = %11000000    ;  COLORS MUST BE IN THE FORM $X (4 bits)
LCD_SET_BACKGROUND_G = %11010000
LCD_SET_BACKGROUND_B = %11100000

lcd_config_instructions:
.byte LCD_ON | %1111    ; turn on display, cursor, blinking, moving right
.byte LCD_TEXT_COLOR | %0000     ; set text to black
.byte LCD_MOVE_CURSOR | 0   ; move cursor to (0,0)
.byte LCD_SET_BACKGROUND_R | $5    ; set backlight to #50a010 (or as close as we can get)
.byte LCD_SET_BACKGROUND_G | $a
.byte LCD_SET_BACKGROUND_B | $1 
.byte LCD_CLEAR
.byte 0

.org $fe00                          ; lookups
keymap:
.byte "????????????? `?" ; 00-0F
.byte "?????q1???zsaw2?" ; 10-1F
.byte "?cxde43?? vftr5?" ; 20-2F
.byte "?nbhgy6???mju78?" ; 30-3F
.byte "?,kio09??./l",$3b,"p-?" ; 40-4F
.byte "??",$27,"?[=????",$0a,"]?\?" ; 50-5F
.byte "?????????1?47???" ; 60-6F
.byte "0.2568",$1b,"??+3-*9??" ; 70-7F
.byte "????????????????" ; 80-8F
.byte "????????????????" ; 90-9F
.byte "????????????????" ; A0-AF
.byte "????????????????" ; B0-BF
.byte "????????????????" ; C0-CF
.byte "????????????????" ; D0-DF
.byte "????????????????" ; E0-EF
.byte "????????????????" ; F0-FF
keymap_shifted:
.byte "????????????? ~?" ; 00-0F
.byte "?????Q!???ZSAW@?" ; 10-1F
.byte "?CXDE#$?? VFTR%?" ; 20-2F
.byte "?NBHGY^???MJU&*?" ; 30-3F
.byte "?<KIO)(??>?L:P_?" ; 40-4F
.byte "??",$22"?{+?????}?|??" ; 50-5F
.byte "?????????1?47???" ; 60-6F
.byte "0.2568???+3-*9??" ; 70-7F
.byte "????????????????" ; 80-8F
.byte "????????????????" ; 90-9F
.byte "????????????????" ; A0-AF
.byte "????????????????" ; B0-BF
.byte "????????????????" ; C0-CF
.byte "????????????????" ; D0-DF
.byte "????????????????" ; E0-EF
.byte "????????????????" ; F0-FF

.org $fffa 
vectors:
.word nmi
.word reset
.word irq