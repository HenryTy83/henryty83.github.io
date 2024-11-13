LCD_OUTPUT = $7fff
STRING_POINTER = $00
DIVISOR = $02 
DIVIDEND = $06
REMAINDER = $04
OUTPUT_LENGTH = $08                          
OUTPUT = $09

.org $8000                                  ; starting position
reset: 
    ldx #$ff                                ; Init stack pointer
    txs

    lda #00
    sta OUTPUT_LENGTH
    sta OUTPUT

setup:
    lda #lcd_config_instructions & $ff
    sta STRING_POINTER
    lda #$80
    sta STRING_POINTER + 1
    jsr write_string

convert:
    lda #$d4             ; NUMBER = 2357
    sta DIVIDEND 
    lda #$5b
    sta DIVIDEND + 1

    lda #10             ; DIVISOR = 10
    sta DIVISOR
    lda #0
    sta DIVISOR + 1

convert_loop:
    jsr divide          ; A = NUMBER % 10 
    lda REMAINDER       

    clc                 ; convert A to string
    adc #'0'
    jsr output_append

    lda DIVIDEND        ; while DIVIDEND != 0
    ora DIVIDEND + 1
    bne convert_loop

    ldx #OUTPUT         ; reverse the string
    jsr reverse_string  

    lda #OUTPUT & $ff  ; print to console
    sta STRING_POINTER
    lda #00
    sta STRING_POINTER + 1

    jsr write_string

loop:
    jmp loop


divide:
    ldx #16            

    lda #00             ; remainder = 0
    sta REMAINDER
    sta REMAINDER + 1
    clc


div_loop:
    rol DIVIDEND        ; rotate
    rol DIVIDEND + 1
    rol REMAINDER
    rol REMAINDER + 1

    sec                 ; a,y = remainder - divisor 
    lda REMAINDER
    sbc DIVISOR
    tay
    lda REMAINDER + 1
    sbc DIVISOR + 1

    bcc div_skip   ; if dividend < divisor

    sty REMAINDER       ; remainder = remainder - divisor
    sta REMAINDER + 1

div_skip:
    dex
    bne div_loop        ; for (x=16; x>0; x--)

    rol DIVIDEND
    rol DIVIDEND + 1

    rts


write_string:
    lda LCD_OUTPUT                  ; wait until LCD ready
    bne write_string

    ldy #00
    lda (STRING_POINTER),y

write_string_loop:   
    sta LCD_OUTPUT
    iny

write_string_wait:
    lda LCD_OUTPUT                  ; wait until LCD ready
    bne write_string_wait

    lda (STRING_POINTER),y
    bne write_string_loop

    rts

output_append:
    pha

    ldx OUTPUT_LENGTH
    sta OUTPUT,x

    inx
    stx OUTPUT_LENGTH

    lda #00
    sta OUTPUT,x

    pla
    rts


reverse_string:
    txa
    tay
    lda #00
    pha

reverse_string_push:            
    lda 0,x
    beq reverse_string_push_done

    pha 
    inx

    clv
    bvc reverse_string_push

reverse_string_push_done:
    tya
    tax
    dex

reverse_string_pull:
    inx
    pla
    sta 0,x
    bne reverse_string_pull

    rts




LCD_CLEAR = %11111111
LCD_ON = %10000000
LCD_CONFIG = %10000000              ; DCBR: (D)isplay, (C)ursor, (B)linking behavior, and (R)ight text direction
LCD_TEXT_COLOR = %10010000 
LCD_MOVE_CURSOR = %10100000 
LCD_SET_BACKGROUND_R = %11000000    ;  COLORS MUST BE IN THE FORM $X (4 bits)
LCD_SET_BACKGROUND_G = %11010000
LCD_SET_BACKGROUND_B = %11100000

lcd_config_instructions:
.byte LCD_CLEAR    ; clear display
.byte LCD_ON | %1111    ; turn on display, cursor, blinking 

.byte LCD_TEXT_COLOR | %0000     ; set text to black

.byte LCD_MOVE_CURSOR | 0   ; move cursor to (0,0)

.byte LCD_SET_BACKGROUND_R | $5    ; set backlight to #50a010 (or as close as we can get)
.byte LCD_SET_BACKGROUND_G | $a
.byte LCD_SET_BACKGROUND_B | $1 
.byte 0

.org $fffc 
vectors:
.word $8000
.word $0000