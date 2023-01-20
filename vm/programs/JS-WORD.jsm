.data16 start { !reset_vector }
//                      it's too late in development to comment this. I'm sorry.
function-setup:
mov $ffff, CLK
mov !function-key_typed, [!_hardware-interrupt_vector-keyboard]
mov 1, IM
mov !text_field, [!cursor_pos]
mov !text_field, [!starting_pos]
mov $20, [!text_field]
mov 0, [!text_field + $02]
mov !cursor_blink_time, [!cursor_character_status]
mov 0, [!_memory_map-sleep_timer]
jmp [!function-loop]


.def frame_sleep $01
.def cursor_blink_time $05
.def cursor_character_template $25ae

.data16 cursor_character { !cursor_character_template }
.data16 cursor_character_status { $0000 }
.data16 cursor_offscreen { $0000 }

function-loop:
mov !font-reset, [!_memory_map-screen_address]
mov !font-green, [!_memory_map-screen_address]

mov [!starting_pos], x
mov (!_memory_map-screen_address + $01), y
cal NUL, [!function-display_text_to_screen]

mov [!cursor_offscreen], acc
jnz [!function-loop]

function-loop-sleep:
mov [!_memory_map-sleep_timer], acc
jlt !frame_sleep, [!function-loop-sleep]

function-loop-sleep-end:
mov 0, [!_memory_map-sleep_timer]

mov [!cursor_character_status], acc
dec acc
mov acc, [!cursor_character_status]
jgz [!function-loop]

mov !cursor_blink_time, [!cursor_character_status]
mov [!cursor_character], acc
sub !cursor_character_template, acc
mov acc, [!cursor_character]
jmp [!function-loop]




.def chars_per_row $4e
.def total_rows $18

function-display_text_to_screen:
mov 0, d
mov 1, w

mov [!cursor_pos], acc
jlt x, [!function-display_text_to_screen-decrement_starting_pos]

function-display_text_to_screen-find_target_pos:
mul d, !chars_per_row
add acc, y
mov acc, y

function-display_text_to_screen-loop:
sub y, !_memory_map-screen_address-end
jez [!function-display_text_to_screen-done]

mov [!cursor_pos], acc
jeq x, [!function-display_text_to_screen-draw_cursor]

function-display_text_to_screen-cursor_skip:
mov &x, acc
jez [!function-display_text_to_screen-done]
jeq !key-newline, [!function-display_text_to_screen-increment_pointers]
mov acc, &y

function-display_text_to_screen-increment_pointers:
mov &x, acc
jez [!function-display_text_to_screen-done]
inc x
inc x
jeq !key-newline, [!function-display_text_to_screen-new_line]
inc y
jmp [!function-display_text_to_screen-loop]

function-display_text_to_screen-new_line:
mov 0, d
sub y, (!_memory_map-screen_address + $01)
mov acc, y
function-display_text_to_screen-find_next_line:
mul d, !chars_per_row
sub acc, y
inc d
jlz [!function-display_text_to_screen-find_next_line]
dec d
mul d, !chars_per_row
add acc, (!_memory_map-screen_address + $01)
mov acc, y
jmp [!function-display_text_to_screen-loop]

function-display_text_to_screen-draw_cursor:
mov 0, w
mov [!cursor_character], acc
jez [!function-display_text_to_screen-cursor_skip]
mov acc, &y
mov &x, acc
jnz [!function-display_text_to_screen-increment_pointers]

function-display_text_to_screen-done:
mov w, acc
jez [!function-display_text_to_screen-return]

mov [!starting_pos], x
inc x
inc x
mov x, [!starting_pos]

function-display_text_to_screen-return:
mov w, [!cursor_offscreen]
rts

function-display_text_to_screen-decrement_starting_pos:
mov [!cursor_pos], x
mov x, [!starting_pos]
rts

// important keys
.def key-backspace $08
.def key-newline $0a
.def key-up_arrow $e000
.def key-right_arrow $e001
.def key-down_arrow $e002
.def key-left_arrow $e003
.def key-insert $e004
.def key-escape $001b

function-key_typed:
mov [!cursor_pos], x
mov [!_memory_map-keyboard], d

sub !key-escape, d
jez [!function-escape_key_pressed]

sub !key-backspace, d
jnz [!function-key_typed-is_insert]
sub x, (!cursor_pos + $02)
jez [!function-key_typed-rti]
cal x, [!function-delete_char_and_shift]
rti

function-key_typed-is_insert:
sub !key-insert, d
jnz [!function-key_typed-is_left_arrow]
cal x, [!function-insert_space_and_unshift]
rti

function-key_typed-is_left_arrow:
sub !key-left_arrow, d
jnz [!function-key_typed-is_up_arrow]
sub x, !text_field
jez [!function-key_typed-rti]
dec x
dec x
jmp [!function-key_typed-end]

function-key_typed-is_up_arrow:
sub !key-up_arrow, d
jnz [!function-key_typed-is_right_arrow]
cal NUL, [!function-find_previous_newline]
mov &FP, x
jmp [!function-key_typed-end]

function-key_typed-is_right_arrow:
sub d, !key-right_arrow
jnz [!function-key_typed-is_down_arrow]
mov &x, acc
jez [!function-key_typed-rti]
inc x
inc x
mul d, !chars_per_row
jgt acc, [!function-key_typed-end]
inc d
jmp [!function-key_typed-end]

function-key_typed-is_down_arrow:
sub !key-down_arrow, d
jnz [!function-key_typed-no_special_keys]
cal NUL, [!function-find_next_newline]
mov &FP, x
jmp [!function-key_typed-end]

function-key_typed-no_special_keys:
mov d, &x
inc x
inc x
cal NUL, [!function-increment_text_length]

function-key_typed-end:
mov x, [!cursor_pos]

function-key_typed-rti:
rti

function-escape_key_pressed:
cal NUL, [!function-save_text]
bki [!function-break]

function-break:
mov 0, IM
mov (!_memory_map-hard_drive + $01), x
mov 0, y
mov 0, mar
mov !_program-JSDOS-skip_splash_screen, d
cal mar, [!_program-bootloader-function-load_program_and_jump]
hlt

.data16 save_data_location { $ffff, $c001 }

function-save_text:
mov [!save_data_location], mar
mov mar, [!_memory_map-hard_drive]
mov !text_length, x
mov [!save_data_location + $02], y
mov [!text_length], acc
cal acc, [!function-mov_data]
rts


// helper functions
function-increment_text_length:
mov [!text_length], acc
add acc, $02
mov acc, [!text_length]
rts

function-decrement_text_length:
mov [!text_length], acc
sub acc, $02
mov acc, [!text_length]
rts

function-delete_char_and_shift:
mov &FP, x
add x, $02
mov x, y

function-delete_char_and_shift-loop:
mov &y, acc
mov acc, &x
jez [!function-delete_char_and_shift-end]
mov y, x
inc y
inc y
jmp [!function-delete_char_and_shift-loop]
function-delete_char_and_shift-end:
cal NUL, [!function-decrement_text_length]
rts

function-insert_space_and_unshift:
mov &FP, x
mov $20, d

function-insert_space_and_unshift-loop:
mov &x, acc
mov d, &x
inc x
inc x
jez [!function-insert_space_and_unshift-end]
mov acc, d
jmp [!function-insert_space_and_unshift-loop]
function-insert_space_and_unshift-end:
mov 0, &x
cal NUL, [!function-increment_text_length]
rts

function-find_previous_newline:
mov x, acc
jeq (!text_field), [!function-find_previous_newline-end]
dec x
dec x
mov &x, acc
jne !key-newline, [!function-find_previous_newline]

function-find_previous_newline-end:
mov x, &FP
rts

function-find_next_newline:
mov &x, acc
jez [!function-find_next_newline-end]
inc x
inc x
mov &x, acc
jne !key-newline, [!function-find_next_newline]

function-find_next_newline-end:
mov x, &FP
rts

.data16 reset_vector { !function-setup }

.data16 cursor_pos { $0000 }
.data16 starting_pos { $0000 }
.data16 text_length { $0000 }
.data16 text_field { $0000 }