LCD_OUTPUT = $7fff

.org $8000  
setup: 
    ldx #00
    lda lcd_config_instructions,x

write_config:     
    sta LCD_OUTPUT
    inx

wait:
    lda LCD_OUTPUT
    bne *-3

    lda lcd_config_instructions,x
    bne write_config

    ldx #00
    lda hello_world_string,x
write_string:   
    sta LCD_OUTPUT
    inx

    lda LCD_OUTPUT
    bne *-3

    lda hello_world_string,x
    bne write_string

loop:
    jmp loop

LCD_CLEAR = %11111111
LCD_ON = %10000000
LCD_CONFIG = %10000000              ; DCBR: (D)isplay, (C)ursor, (B)linking behavior, and (R)ight text direction
LCD_TEXT_COLOR = %10010000 
LCD_MOVE_CURSOR = %10100000 
LCD_SET_BACKGROUND_R = %11000000    ;  COLORS MUST BE IN THE FORM $X0 (take the 4 highest bytes, giving just X)
LCD_SET_BACKGROUND_G = %11010000
LCD_SET_BACKGROUND_B = %11100000

lcd_config_instructions:
.byte LCD_CLEAR    ; clear display
.byte (LCD_ON|%1111)     ; turn on display, cursor, blinking 

.byte (LCD_TEXT_COLOR|%0000)    ; set text to black

.byte (LCD_MOVE_CURSOR|0)   ; move cursor to (0,0)

.byte (LCD_SET_BACKGROUND_R|($5a>4))    ; set backlight to #50a010 #5aa518
.byte (LCD_SET_BACKGROUND_G|($a5>4)) 
.byte (LCD_SET_BACKGROUND_B|($18>4)) 
.byte 0

hello_world_string:
.text "Hello,",$20,"World!",0

.org $fffc
reset:
.word $8000
.word $0000