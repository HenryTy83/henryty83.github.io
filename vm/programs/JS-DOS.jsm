.org $6000
.data16 _file.length { (!reset_vector - $6000 + $02) }

.global font.reset $8000
.global font.italic $4000
.global font.bold $2000

.global font.red $0f00
.global font.green $00f0
.global font.blue  $000f

.def chars_per_row $4e

.data16 tjsvmtdhaa { $0054, $004a, $0053, $0056, $004d, $0054, $0044, $0048, $0041, $0041, $003a, $0020, $0000, $0000 } 
.data16 acronym_expand { $0054, $0068, $0065, $0020, $0000, $004a, $0061, $0076, $0061, $0053, $0063, $0072, $0069, $0070, $0074, $0020, $0000, $0056, $0069, $0072, $0074, $0075, $0061, $006c, $0020, $0000, $004d, $0061, $0063, $0068, $0069, $006e, $0065, $0020, $0000, $0054, $0068, $0061, $0074, $0020, $0000, $0044, $006f, $0065, $0073, $006e, $0027, $0074, $0020, $0000, $0048, $0061, $0076, $0065, $0020, $0000, $0041, $006e, $0020, $0000, $0041, $0063, $0072, $006f, $006e, $0079, $006d, $0000, $0000 } 
.data16 credits { $00a9, $0020, $0048, $0065, $006e, $0072, $0079, $0020, $0054, $0079, $002c, $0020, $0032, $0030, $0032, $0032, $002d, $0033, $0000, $0000 }

function.setup:
mov [!_memory_map.keyboard], NUL
mov 0, IM
mov $ffff, CLK

mov 0, [!reservations]
mov 0, [!reservations + $02]
mov $6000, [!reservations + $04]
mov $ffff, [!reservations + $06] 

mov !font.reset, [!_memory_map.screen_address]

.def scratch_sound $8380
.def scratch_duration $401e

mov !scratch_sound, [!_memory_map.sound.noise]
mov !scratch_duration, [!_memory_map.sound.noise]

//                                                                         textStyle(true, true, color(0, 255, 0), 1)
mov (!font.italic + !font.bold + !font.green), [!_memory_map.screen_address]
//                                                                         text('TJSVMTDHAA', 0, 0, 1, 320)
mov !tjsvmtdhaa, x
mov (!_memory_map.screen_address + $01), y
mov $02, r7
cal $60, [!function.draw_splash_screen]


//                                                                         textStyle(false, false, color(0, 255, 0))
mov (!font.green), [!_memory_map.screen_address]
//                                                                         text('The JavaScript Virtual Machine That Doesn't Have An Acronym', 0, 0, 0, 600)
mov !acronym_expand, x
mov &SP, y
mov $00, r7
cal $05, [!function.draw_splash_screen]

//                                                                         sleep(800)
cal $40, [!function.sleep]

mov $8fc6, [!bloop_sound]

//                                                                         text('Henry Ty, 2022-3', 0, 1, 0, 800)
mov !credits, x
mov ($01 * !chars_per_row + !_memory_map.screen_address + $01), y
mov (!font.italic + !font.bold + !font.green), [!_memory_map.screen_address]
mov $00, r7
cal $b0, [!function.draw_splash_screen]

jmp [!function.loop]

function.loop:
.global_label _program.JSDOS.skip_splash_screen:

//                                                                          loadProgramAndRun(0xc001, 0, 1)
mov (!_memory_map.hard_drive + $01), x
mov 0, y
mov 1, mar
cal mar, [!bootloader.function.load_file]
mov &SP, mar
mov &mar, acc
add acc, mar
dec acc
dec acc
mov acc, [!reservations + $02]
mov &acc, PC

jmp [!function.loop]

.global_label throw_error:
mov 0, x
mov 0, y
cal [!console.move_cursor]

mov &FP, mar
mov !font.reset, [!_memory_map.screen_address]
mov (!font.bold + !font.red), [!_memory_map.screen_address]
cal mar, [!console.print]

mov !error_noise, [!_memory_map.sound.square]
mov !error_noise_duration, [!_memory_map.sound.square]

mov !_software.reset, [!_hardware.interrupt_vector.keyboard]
mov 1, IM
mov 1, CLK

error_thrown:
jmp [!error_thrown]

.def error_noise $be14
.def error_noise_duration $401e

.data16 out_of_ram_error { $2639, $20, $46, $41, $54, $41, $4C, $20, $45, $52, $52, $4F, $52, $3A, $20, $4F, $75, $74, $20, $6F, $66, $20, $75, $73, $65, $61, $62, $6C, $65, $20, $52, $41, $4D, $2E, $20, $50, $72, $65, $73, $73, $20, $61, $6E, $79, $20, $6B, $65, $79, $20, $74, $6F, $20, $72, $65, $73, $65, $74, $00 }

//                                                                          text([char] string, x, y, letterSleep, mainSleep)
function.draw_splash_screen:
mov &FP, r8
mov &x, acc
inc x
inc x
jez [!function.draw_splash_screen.end]
mov acc, &y
inc y

mov 0, [!_memory_map.sleep_timer]
cal r7, [!function.sleep]
jmp [!function.draw_splash_screen]

function.draw_splash_screen.end:
mov 0, [!_memory_map.sleep_timer]
cal r8, [!function.sleep]

mov [!bloop_sound], acc
mov acc, [!_memory_map.sound.sine]
add acc, $03
mov acc, [!bloop_sound]

mov !bloop_duration, [!_memory_map.sound.sine]

mov &x, acc
jnz [!function.draw_splash_screen]

mov y, &FP
rts

.data16 bloop_sound { $8fc6 }
.def bloop_duration $401e

function.sleep:
mov &FP, d
mov [!_memory_map.sleep_timer], acc
jlt d, [!function.sleep]
rts


.data16 cursor_pos { (!_memory_map.screen_address + $01) }

.global_label console.char:
mul y, !chars_per_row
add x, acc
add acc, (!_memory_map.screen_address + $01)
mov &FP, d
mov d, &acc
rts

.global_label console.move_cursor:
mul y, !chars_per_row
add x, acc
add acc, (!_memory_map.screen_address + $01)
mov acc, [!cursor_pos]
rts

.def key.newline $0a

.global_label console.print:
mov &FP, x
mov [!cursor_pos], y

console.print.loop:
sub y, !_memory_map.screen_address.end
jez [!console.print.done]


console.print.increment_pointers:
mov &x, acc
jez [!console.print.done]
inc x
inc x
jeq !key.newline, [!console.print.new_line]
mov acc, &y
inc y
jmp [!console.print.loop]

console.print.new_line:
mov 0, d
sub y, (!_memory_map.screen_address + $01)
mov acc, y
console.print.find_next_line:
mul d, !chars_per_row
sub acc, y
inc d
jlz [!console.print.find_next_line]
dec d
mul d, !chars_per_row
add acc, (!_memory_map.screen_address + $01)
mov acc, y
jmp [!console.print.loop]

console.print.done:
rts

//                                          takes a size to reserve and returns the address
.global_label kernel.malloc:
mov &FP, w
mov (!reservations + $02), x

function.malloc.search:
mov &x, mar
inc x
inc x
mov &x, acc
sub acc, mar
jgt w, [!function.malloc.found]
inc x
inc x
mov &x, acc
jne $ffff, [!function.malloc.search]

//                                          Ran out of free RAM (FATAL ERROR)
cal !out_of_ram_error, [!throw_error]

function.malloc.found:
add mar, w
inc mar
mov mar, &FP
mov mar, r7
mov acc, r8
cal [!function.malloc.insert_reservation]
rts

function.malloc.insert_reservation:
mov r7, acc
mov &x, r7
mov acc, &x
inc x
inc x
mov r8, acc
mov &x, r8
mov acc, &x
inc x
inc x
jne $ffff, [!function.malloc.insert_reservation]
rts

//                                          frees up an address
.global_label kernel.free:
mov &FP, mar
mov !reservations, x

kernel.free.search:
rts



.data16 reset_vector { !function.setup }
// END OF FILE

.data16 reservations { $0000 }