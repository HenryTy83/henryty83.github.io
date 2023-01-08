.data16 _file-length { !reset_vector }

.global font-reset $8000
.global font-italic $4000
.global font-bold $2000

.global font-red $0f00
.global font-green $00f0
.global font-blue  $000f

.data16 splash_screen { $0054 $004a $0053 $0056 $004d $0054 $0044 $0048 $0041 $0041 $0000 $0054 $0068 $0065 $0020 $004a $0061 $0076 $0061 $0053 $0063 $0072 $0069 $0070 $0074 $0020 $0056 $0069 $0072 $0074 $0075 $0061 $006c $0020 $004d $0061 $0063 $0068 $0069 $006e $0065 $0020 $0054 $0068 $0061 $0074 $0020 $0044 $006f $0065 $0073 $006e $0027 $0074 $0020 $0048 $0061 $0076 $0065 $0020 $0041 $006e $0020 $0041 $0063 $0072 $006f $006e $0079 $006d $0000 $00a9 $0020 $0048 $0065 $006e $0072 $0079 $0020 $0054 $0079 $002c $0020 $0032 $0030 $0032 $0032 $002d $0033 }

function-setup:
mov 0, IM
mov 1, CLK
mov !font-reset, [!_memory_map-screen_address]

mov !splash_screen, x
mov (!_memory_map-screen_address + $01), y
mov (!font-italic + !font-bold + !font-green), [!_memory_map-screen_address]
cal NUL, [!function-draw_splash_screen]

cal $0a, [!function-sleep]

mov $ffff, CLK
jmp [!function-loop]

function-loop:
.global_label _program-JSDOS-skip_splash_screen:

mov (!_memory_map-hard_drive + $01), x
mov 0, y
mov 1, mar
cal mar, [!_program-bootloader-function-load_program_and_run]

jmp [!function-loop]

function-draw_splash_screen:
mov &x, acc
inc x
inc x
jez [!function-draw_splash_screen-end]
mov acc, &y
inc y
jmp [!function-draw_splash_screen]

function-draw_splash_screen-end:
rts

function-sleep:
mov &FP, d
mov [!_memory_map-sleep_timer], acc
jlt d, [!function-sleep]
rts

.data16 reset_vector { !function-setup }