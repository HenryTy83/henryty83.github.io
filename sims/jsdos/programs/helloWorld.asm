LCD_OUTPUT = $7fff

.org $8000  
setup:
    ldx #$00

    lda #%11111111     ; clear display
    sta LCD_OUTPUT

    lda #%10001111     ; turn on display, cursor, blinking 
    sta LCD_OUTPUT

    lda #%10110000     ; set cursor to black
    sta LCD_OUTPUT

    lda #%10010000     ; move cursor to (0,0)
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

    lda #'e'
    sta LCD_OUTPUT

    lda #'l'
    sta LCD_OUTPUT

    lda #'l'
    sta LCD_OUTPUT

    lda #'o'
    sta LCD_OUTPUT

    lda #','
    sta LCD_OUTPUT

    lda #$20
    sta LCD_OUTPUT

    lda #'W'
    sta LCD_OUTPUT

    lda #'o'
    sta LCD_OUTPUT

    lda #'r'
    sta LCD_OUTPUT

    lda #'l'
    sta LCD_OUTPUT

    lda #'d'
    sta LCD_OUTPUT

    lda #'!'
    sta LCD_OUTPUT

loop:
    jmp loop

hello_world_string:
.text "Hello,",$20,"World!",0

.org $fffc
reset:
.word $8000
.word $0000