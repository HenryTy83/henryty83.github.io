// quickly fill the screen with characters
// demo of the screen display
.def full_colors $0fff

start:
mov $ffff, CLK
mov !full_colors, d
mov $8001, x
mov $0021, y

loop:
mov d, [$8000]
dec d

mov d, acc
jnz [!skip]

mov !full_colors, d
skip:

mov y, &x
inc x

mov x, acc
jne $8751, [!loop]

mov $8001, x
inc y

jmp [!loop]

// reset vector
.org $7ffe
.data16 reset_vector { !start }