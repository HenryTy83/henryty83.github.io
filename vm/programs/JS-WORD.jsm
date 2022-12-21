.data16 start { !reset_vector }

_function-main:
mov $fff, CLK
mov !_function-key_typed, [!_hardware-interrupt_vector-keyboard]
mov (!cursor_pos + $02), [!cursor_pos]
mov !cursor_blink_time, [!cursor_character]

_function-main-loop:
mov $f000, [!_memory_map-screen_address]
mov $00f0, [!_memory_map-screen_address]
mov (!cursor_pos + $02), x
mov (!_memory_map-screen_address + $01), y
cal &0, [!_function-display_text_to_screen]
cal $08, [!_function-sleep]
mov [!cursor_character_status], x
dec x
jgz [!_function-main-loop-update_blink_timer]
mov !cursor_blink_time, x
mov [!cursor_character], acc
sub !cursor_character_template, acc
mov acc, [!cursor_character]
_function-main-loop-update_blink_timer:
mov x, [!cursor_character_status]
mov $ffff, acc
_function-main-loop-busy_wait:
dec acc
jgz [!_function-main-loop-busy_wait]
jmp [!_function-main-loop]

.def cursor_blink_time $01
.def cursor_character_template $25af
.data16 cursor_character { $0000 }
.data16 cursor_character_status { $0000 }

.def chars_per_row $4e

_function-display_text_to_screen:
mov &FP, d
_function-display_text_to_screen-find_target_pos:
mul d, !chars_per_row
add acc, y
mov acc, y
_function-display_text_to_screen-loop:
mov [!cursor_pos], acc
jeq x, [!_function-display_text_to_screen-draw_cursor]
_function-display_text_to_screen-cursor_skip:
mov &x, acc
jez [!_function-display_text_to_screen-done]
jeq !key-newline, [!_function-display_text_to_screen-increment_pointers]
mov acc, &y
_function-display_text_to_screen-increment_pointers:
mov &x, acc
inc x
inc x
jeq !key-newline, [!_function-display_text_to_screen-new_line]
inc y
jmp [!_function-display_text_to_screen-loop]
_function-display_text_to_screen-new_line:
mov (!_memory_map-screen_address + $01), y
inc d
jmp [!_function-display_text_to_screen-find_target_pos]
_function-display_text_to_screen-draw_cursor:
mov [!cursor_character], acc
jez [!_function-display_text_to_screen-cursor_skip]
mov acc, &y
mov &x, acc
jnz [!_function-display_text_to_screen-increment_pointers]
_function-display_text_to_screen-done:
rts

// important keys
.def key-backspace $08
.def key-newline $0a
.def key-up_arrow $e000
.def key-right_arrow $e001
.def key-down_arrow $e002
.def key-left_arrow $e003
.def key-insert $e004

_function-key_typed:
mov [!cursor_pos], x
mov [!_memory_map-keyboard], d
sub !key-backspace, d
jnz [!_function-key_typed-is_insert]
mov &x, acc
jez [!_function-key_typed-rti]
cal &x, [!_function-delete_char_and_shift]
rti
_function-key_typed-is_insert:
sub !key-insert, d
jnz [!_function-key_typed-is_left_arrow]
cal &x, [!_function-insert_space_and_unshift]
rti
_function-key_typed-is_left_arrow:
sub !key-left_arrow, d
jnz [!_function-key_typed-is_up_arrow]
sub x, (!cursor_pos + $02)
jez [!_function-key_typed-rti]
dec x
dec x
jmp [!_function-key_typed-end]
_function-key_typed-is_up_arrow:
sub !key-up_arrow, d
jnz [!_function-key_typed-is_right_arrow]
cal &0, [!_function-find_previous_newline]
mov &FP, x
jmp [!_function-key_typed-end]
_function-key_typed-is_right_arrow:
sub d, !key-right_arrow
jnz [!_function-key_typed-is_down_arrow]
mov &x, acc
jez [!_function-key_typed-rti]
inc x
inc x
jmp [!_function-key_typed-end]
_function-key_typed-is_down_arrow:
sub !key-down_arrow, d
jnz [!_function-key_typed-no_special_keys]
cal &0, [!_function-find_next_newline]
mov &FP, x
jmp [!_function-key_typed-end]
_function-key_typed-no_special_keys:
mov d, &x
inc x
inc x
_function-key_typed-end:
mov x, [!cursor_pos]
_function-key_typed-rti:
rti

// helper functions
_function-delete_char_and_shift:
mov &FP, x
add x, $02
mov x, y
_function-delete_char_and_shift-loop:
mov &y, acc
mov acc, &x
jez [!function-delete_char_and_shift-end]
mov y, x
inc y
inc y
jmp [!_function-delete_char_and_shift-loop]
function-delete_char_and_shift-end:
rts
_function-insert_space_and_unshift:
mov &FP, x
mov $20, d
_function-insert_space_and_unshift-loop:
mov &x, acc
mov d, &x
inc x
inc x
jez [!function-insert_space_and_unshift-end]
mov acc, d
jmp [!_function-insert_space_and_unshift-loop]
function-insert_space_and_unshift-end:
mov 0, &x
rts
_function-find_previous_newline:
mov x, acc
jeq (!cursor_pos + $02), [!_function-find_previous_newline-end]
dec x
dec x
mov &x, acc
jne !key-newline, [!_function-find_previous_newline]
_function-find_previous_newline-end:
mov x, &FP
rts
_function-find_next_newline:
mov &x, acc
jez [!_function-find_next_newline-end]
inc x
inc x
mov &x, acc
jne !key-newline, [!_function-find_next_newline]
_function-find_next_newline-end:
mov x, &FP
rts


.global_label _function-sleep:
mov &FP, d
mov [!_hardware-interrupt_vector-sleep_timer], w
mov !timer_expired, [!_hardware-interrupt_vector-sleep_timer]
psh CLK
mov $0f, CLK
mov d, [!_memory_map-sleep_timer]
_function-sleep-wait:
jmp [!_function-sleep-wait]
_function-sleep-done:
mov w, [!_hardware-interrupt_vector-sleep_timer]
pop CLK
rts
timer_expired:
pop NUL
psh !_function-sleep-done
rti


.data16 reset_vector { !_function-main }

.data16 cursor_pos { $0000 }
.data16 text_field { $0000 }