CONSOLE_DATA = $7fff
CONSOLE_ENABLE = $7ffe

.org $8000  
setup:
    ldx $00

    lda hello_world_string,x
    sta CONSOLE_DATA 
    inx

    lda #'e'
    sta CONSOLE_DATA 

    lda #'l'
    sta CONSOLE_DATA 

    lda #'l'
    sta CONSOLE_DATA 

    lda #'o'
    sta CONSOLE_DATA 

    lda #','
    sta CONSOLE_DATA 

    lda #$20
    sta CONSOLE_DATA

    lda #'W'
    sta CONSOLE_DATA 

    lda #'o'
    sta CONSOLE_DATA 

    lda #'r'
    sta CONSOLE_DATA 

    lda #'l'
    sta CONSOLE_DATA 

    lda #'d'
    sta CONSOLE_DATA 

    lda #'!'
    sta CONSOLE_DATA

    lda #$00
    sta CONSOLE_ENABLE

loop:
    jmp loop

hello_world_string:
.text "Hello,",$20,"World!",0

.org $fffc
reset:
.word $8000
.word $0000