.data16 start { !reset_vector - $00 + $02 }
//                      it's too late in development to comment this. I'm sorry.
function.setup:
mov $ffff, CLK
mov !function.key_typed, [!_hardware.interrupt_vector.keyboard]
mov 1, IM

cal $1000, [!kernel.malloc]
mov &SP, mar
mov mar, [!text_field_location]

mov mar, [!cursor_pos]
mov mar, [!starting_pos]
mov $20, &mar
mov 0, &mar, $02
mov !cursor_blink_time, [!cursor_character_status]

mov 0, [!_memory_map.sleep_timer]
jmp [!function.loop]

.data16 text_field_location { $0000 }
.data16 cursor_pos { $0000 }
.data16 starting_pos { $0000 }
.data16 text_length { $0000 }

.def frame_sleep $01
.def cursor_blink_time $05
.def cursor_character_template $25ae

.data16 cursor_character { !cursor_character_template }
.data16 cursor_character_status { $0000 }
.data16 cursor_offscreen { $0000 }

function.loop:
mov !font.reset, [!_memory_map.screen_address]
mov !font.green, [!_memory_map.screen_address]

mov 0, x
mov 0, y
cal [!console.move_cursor]
mov [!starting_pos], mar
cal mar, [!console.print]

function.loop.sleep:
mov [!_memory_map.sleep_timer], acc
jlt !frame_sleep, [!function.loop.sleep]

function.loop.sleep.end:
mov 0, [!_memory_map.sleep_timer]

mov [!cursor_character_status], acc
dec acc
mov acc, [!cursor_character_status]
jgz [!function.loop]

mov !cursor_blink_time, [!cursor_character_status]
mov [!cursor_character], acc
sub !cursor_character_template, acc
mov acc, [!cursor_character]
jmp [!function.loop]


.def chars_per_row $4e
.def total_rows $18

// important keys
.def key.backspace $08
.def key.newline $0a
.def key.up_arrow $e000
.def key.right_arrow $e001
.def key.down_arrow $e002
.def key.left_arrow $e003
.def key.insert $e004
.def key.escape $001b

function.key_typed:
mov [!text_field_location], mar
mov [!cursor_pos], x
mov [!_memory_map.keyboard], d

sub !key.escape, d
jez [!function.escape_key_pressed]

sub !key.backspace, d
jnz [!function.key_typed.is_insert]
sub x, (!cursor_pos + $02)
jez [!function.key_typed.rti]
cal x, [!function.delete_char_and_shift]
rti

function.key_typed.is_insert:
sub !key.insert, d
jnz [!function.key_typed.is_left_arrow]
cal x, [!function.insert_space_and_unshift]
rti

function.key_typed.is_left_arrow:
sub !key.left_arrow, d
jnz [!function.key_typed.is_up_arrow]
sub x, mar
jez [!function.key_typed.rti]
dec x
dec x
jmp [!function.key_typed.end]

function.key_typed.is_up_arrow:
sub !key.up_arrow, d
jnz [!function.key_typed.is_right_arrow]
cal [!function.find_previous_newline]
mov &FP, x
jmp [!function.key_typed.end]

function.key_typed.is_right_arrow:
sub d, !key.right_arrow
jnz [!function.key_typed.is_down_arrow]
mov &x, acc
jez [!function.key_typed.rti]
inc x
inc x
mul d, !chars_per_row
jgt acc, [!function.key_typed.end]
inc d
jmp [!function.key_typed.end]

function.key_typed.is_down_arrow:
sub !key.down_arrow, d
jnz [!function.key_typed.is_enter]
cal [!function.find_next_newline]
mov &FP, x
jmp [!function.key_typed.end]

function.key_typed.no_special_keys:
mov d, &x
inc x
inc x
cal NUL, [!function.increment_text_length]

function.key_typed.end:
mov x, [!cursor_pos]

function.key_typed.rti:
bki [!function.loop.sleep.end]

function.type_key:
psh d
mov &FP, d
mov d, &x
inc x
inc x
cal [!function.increment_text_length]
pop d
rts

function.escape_key_pressed:
cal [!function.save_text]
bki [!function.break]

function.break:
mov 0, IM
mov (!_memory_map.hard_drive + $01), x
mov 0, y
mov 0, mar
mov !_program.JSDOS.skip_splash_screen, d
cal mar, [!_program.bootloader.function.load_program_and_jump]
hlt

.data16 save_data_location { $ffff, $c001 }

function.save_text:
mov [!save_data_location], mar
mov mar, [!_memory_map.hard_drive]
mov !text_length, x
mov [!save_data_location + $02], y
mov [!text_length], acc
cal acc, [!function.mov_data]
rts


// helper functions
function.increment_text_length:
mov [!text_length], acc
add acc, $02
mov acc, [!text_length]
jmp [!function.update_null_terminator]

function.decrement_text_length:
mov [!text_length], acc
sub acc, $02
mov acc, [!text_length]

function.update_null_terminator:
mov [!text_field_location], mar
add mar, acc
mov 0, &acc
rts

function.delete_char_and_shift:
mov &FP, x
add x, $02
mov x, y

function.delete_char_and_shift.loop:
mov &y, acc
mov acc, &x
jez [!function.delete_char_and_shift.end]
mov y, x
inc y
inc y
jmp [!function.delete_char_and_shift.loop]
function.delete_char_and_shift.end:
cal [!function.decrement_text_length]
rts

function.insert_space_and_unshift:
mov &FP, x
mov $20, d

function.insert_space_and_unshift.loop:
mov &x, acc
mov d, &x
inc x
inc x
jez [!function.insert_space_and_unshift.end]
mov acc, d
jmp [!function.insert_space_and_unshift.loop]
function.insert_space_and_unshift.end:
mov 0, &x
cal [!function.increment_text_length]
rts

function.find_previous_newline:
mov x, acc
jeq mar, [!function.find_previous_newline.end]
dec x
dec x
mov &x, acc
jne !key.newline, [!function.find_previous_newline]

function.find_previous_newline.end:
mov x, &FP
rts

function.find_next_newline:
mov &x, acc
jez [!function.find_next_newline.end]
inc x
inc x
mov &x, acc
jne !key.newline, [!function.find_next_newline]

function.find_next_newline.end:
mov x, &FP
rts

.data16 reset_vector { !function.setup }