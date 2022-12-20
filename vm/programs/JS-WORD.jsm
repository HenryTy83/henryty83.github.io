.data16 length { !reset_vector }
start:
mov 1, CLK
mov !key_typed, [!_hardware-interrupt_vector-keyboard]
mov 1, [!cursor_pos]

loop:
mov [!cursor_pos + $02], w

add 1, !_memory_map-screen_address

mov $00f0, [!_memory_map-screen_address]
mov w, &acc

jmp [!loop]

key_typed:
mov [!_memory_map-keyboard], w

mov [!cursor_pos], x
shl x, 1
mov w, &acc, !cursor_pos

inc x
mov x, [!cursor_pos]
rti


.data16 reset_vector { !start }

.data16 cursor_pos { $0000 }
.data16 text_field { $0000 }