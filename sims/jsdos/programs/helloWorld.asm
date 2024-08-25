LCD_OUTPUT = $7fff

.org $8000  
setup:
    ldx #$00

    lda #%11111111     ; clear display
    sta LCD_OUTPUT

    lda #%10001111     ; turn on display, cursor, blinking 
    sta LCD_OUTPUT

    lda #%10010000     ; set cursor to black
    sta LCD_OUTPUT

    lda #%10100000     ; move cursor to position 0
    sta LCD_OUTPUT

    lda #%11000101     ; set backlight to #50a010
    sta LCD_OUTPUT
    lda #%11011010
    sta LCD_OUTPUT
    lda #%11100001
    sta LCD_OUTPUT

write_string:   
    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

    lda hello_world_string,x
    sta LCD_OUTPUT
    inx

loop:
    jmp loop

.byte (3*2+1)

lcd_config_instructions:
LCD_CLEAR = %11111111
LCD_ON = %10000000
LCD_CONFIG = %10000000              ; DCBR: (D)isplay, (C)ursor, (B)linking behavior, and (R)ight text direction
LCD_TEXT_COLOR = %10010000 
LCD_MOVE_CURSOR = %10100000 
LCD_SET_BACKGROUND_R = %11000000    ;  COLORS MUST BE IN THE FORM $X0 (take the 4 highest bytes, giving just X)
LCD_SET_BACKGROUND_G = %11000000
LCD_SET_BACKGROUND_B = %11000000

.byte LCD_CLEAR    ; clear display
.byte (LCD_CONFIG+%1111)     ; turn on display, cursor, blinking 

.byte (LCD_TEXT_COLOR+0)    ; set text to black

.byte (LCD_MOVE_CURSOR+$00)   ; move cursor to (0,0)

.byte (LCD_SET_BACKGROUND_R+($5a>4))    ; set backlight to #50a010 #5aa518
.byte (LCD_SET_BACKGROUND_G+($a5>4)) 
.byte (LCD_SET_BACKGROUND_B+($14>4)) 
.byte 0

hello_world_string:
.text "Hello,",$20,"World!",0

.org $fffc
reset:
.word $8000
.word $0000