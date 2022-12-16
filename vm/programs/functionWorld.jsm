// Hello world program, but using loops
// test of branching and alu operations
.def screen_address $8000
.def chars_per_row $4e

start:
mov SP x
mov $00 &x
psh $00

main:
psh x
mov $ffff CLK
mov $ffff [!screen_address]
cal &x [!draw_column]
mov $05 CLK
pop x

mov &x acc

sub acc $42
jez [!skip_inc]
add acc $43

skip_inc:
mov acc &x

jmp [!main]

draw_column:
mov $0 d

init_settings:
sub $f d
shl acc $4
mov !screen_address y
mov acc &y

// set position 
mul d !chars_per_row
add acc y
mov &FP w
mov &w w
add acc w
mov acc y

loop:
inc y
mov &x acc
jez [!break]
mov acc &y
inc x
inc x
jmp [!loop]

break:
mov !hello_world_string x
inc d
mov d acc
jne $10 [!init_settings]

end:
rts

// hello world string (null terminated)
.org $4000
.data16 hello_world_string { $0048 $0065 $006c $006c $006f $0020 $0057 $006f $0072 $006c $0064 $0021 $0000 }

// reset vector
.org $7ffe
.data16 reset_vector { !start }