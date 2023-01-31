.org $9000
.data16 _file-length { !reset_vector }

.global font-reset $8000
.global font-italic $4000
.global font-bold $2000

.global font-red $0f00
.global font-green $00f0
.global font-blue  $000f

.def chars_per_row $4e

.data16 tjsvmtdhaa { $0054 $004a $0053 $0056 $004d $0054 $0044 $0048 $0041 $0041 $003a $0020 $0000 $0000 } 
.data16 acronym_expand { $0054 $0068 $0065 $0020 $0000 $004a $0061 $0076 $0061 $0053 $0063 $0072 $0069 $0070 $0074 $0020 $0000 $0056 $0069 $0072 $0074 $0075 $0061 $006c $0020 $0000 $004d $0061 $0063 $0068 $0069 $006e $0065 $0020 $0000 $0054 $0068 $0061 $0074 $0020 $0000 $0044 $006f $0065 $0073 $006e $0027 $0074 $0020 $0000 $0048 $0061 $0076 $0065 $0020 $0000 $0041 $006e $0020 $0000 $0041 $0063 $0072 $006f $006e $0079 $006d $0000 $0000 } 
.data16 credits { $00a9 $0020 $0048 $0065 $006e $0072 $0079 $0020 $0054 $0079 $002c $0020 $0032 $0030 $0032 $0032 $002d $0033 $0000 $0000 }

function-setup:
mov 0, IM
mov $ffff, CLK

mov $4000, [!free_spots]
mov $1000, [!free_spots + $02]

mov !font-reset, [!_memory_map-screen_address]

//                                                                         textStyle(true, true, color(0, 255, 0), 1, 1600)
mov (!font-italic + !font-bold + !font-green), [!_memory_map-screen_address]
//                                                                         text('TJSVMTDHAA', 0, 0)
mov !tjsvmtdhaa, x
mov (!_memory_map-screen_address + $01), y
mov $01, r7
cal $10, [!function-draw_splash_screen]


//                                                                         textStyle(false, false, color(0, 255, 0))
mov (!font-green), [!_memory_map-screen_address]
//                                                                         text('The JavaScript Virtual Machine That Doesn't Have An Acronym', 0, 0, 0, 300)
mov !acronym_expand, x
mov &SP, y
mov $00, r7
cal $03, [!function-draw_splash_screen]

//                                                                         sleep(800)
cal $08, [!function-sleep]

//                                                                         text('Henry Ty, 2022-3', 0, 1, 0, 48)
mov !credits, x
mov ($01 * !chars_per_row + !_memory_map-screen_address + $01), y
mov (!font-italic + !font-bold + !font-green), [!_memory_map-screen_address]
mov $00, r7
cal $30, [!function-draw_splash_screen]

jmp [!function-loop]

function-loop:
.global_label _program-JSDOS-skip_splash_screen:

//                                                                          loadProgramAndRun(0, 0, 1)
mov (!_memory_map-hard_drive + $01), x
mov 0, y
mov 1, mar
cal mar, [!_program-bootloader-function-load_program_and_run]

jmp [!function-loop]

//                                                                          text([char] string, x, y, letterSleep, mainSleep)
function-draw_splash_screen:
mov &FP, r8
mov &x, acc
inc x
inc x
jez [!function-draw_splash_screen-end]
mov acc, &y
inc y

mov 0, [!_memory_map-sleep_timer]
cal r7, [!function-sleep]
jmp [!function-draw_splash_screen]

function-draw_splash_screen-end:
mov 0, [!_memory_map-sleep_timer]
cal r8, [!function-sleep]

mov &x, acc
jnz [!function-draw_splash_screen]

mov y, &FP
rts

function-sleep:
mov &FP, d
mov [!_memory_map-sleep_timer], acc
jlt d, [!function-sleep]
rts

//                                          takes a size to reserve and returns the address
.global_label kernel-malloc:
mov &FP, w
inc w
mov !free_spots, x
function-malloc-search:
mov &x, acc
jgt w, [!function-malloc-found]
add x, $04
mov acc, x
jmp [!function-malloc-search]
function-malloc-found:
mov &x, acc
sub acc, w
mov acc, d
mov acc, &x
inc x
inc x
mov &x, mar
mov mar, &acc
mov mar, &FP
add mar, w
mov acc, &x
rts

//                                          frees up an address
.global_label kernel-free:
mov &FP, mar
mov &mar, w
mov !free_spots 
rts

.data16 reset_vector { !function-setup }

.data16 free_spots { $0000 }