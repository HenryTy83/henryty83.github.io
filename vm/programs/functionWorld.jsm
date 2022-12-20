// Hello world program, but using subroutines
.data16 _this-length { !reset_vector }

.def chars_per_row $4e

start:
mov SP, x
psh 0

move_right:
cal &x, [!call_draw]
mov &SP, x

mov &x, acc
inc acc
mov acc, &x

jlt $42, [!move_right]

// cal [$0a] [!delay]

move_left:
cal &x, [!call_draw]
mov &SP, x

mov &x, acc
dec acc
mov acc, &x

jnz [!move_left]

// cal [$0a] [!delay]
jmp [!move_right]


call_draw:
mov $ffff, CLK
mov $ffff, [!_memory_map-screen_address]
cal &x, [!draw_column]
mov $07, CLK

// cal &1 [!delay]

rts


delay:
psh CLK
mov 1, CLK

mov &FP, acc
delay_wait:
dec acc
jgz [!delay_wait]

pop CLK
rts

draw_column:
mov 0, d

draw_column_loop:
sub $0f, d
shl acc, $4
mov !_memory_map-screen_address, y
mov acc, &y

mul d, !chars_per_row
add acc, y
mov &FP, w
mov &w, w
add acc, w
mov acc, y
inc y

psh d
cal &y, [!draw_string]
pop d

inc d
sub d, $10
jnz [!draw_column_loop]
rts

draw_string:
mov &FP, x
mov !hello_world_string, y

draw_string_loop:
mov &y, acc
jez [!draw_string_end]
mov acc, &x
inc x
inc y
inc y
jmp [!draw_string_loop]

draw_string_end:
rts


// hello world string (null terminated)
.data16 hello_world_string { $0048 $0065 $006c $006c $006f $0020 $0057 $006f $0072 $006c $0064 $0021 $0000 }

.data16 reset_vector { !start }