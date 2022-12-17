//                                               useful global constants
.global _memory_map-program_mem $0000
.global _memory_map-working_mem $4000
.global _memory_map-screen_address $8000
.global _memory_map-hard_drive $c000

.org $a000
.global_label _memory_map-rom:
bootloader-start:
//                                               set the stack pointer
mov $7fec SP

//                                               load a program from sector 0
mov 0 [!_memory_map-hard_drive]

mov $ffff CLK
cal &1 [!_program-bootloader-load_program]
mov 1 CLK

mov &SP PC
hlt

//                                               loading a program: operands: first, set the sector correctly, then cal with the address
.global_label _program-bootloader-load_program:

//                                               fetch target address
mov &FP d
mov !_memory_map-hard_drive x
add d x

//                                               set x (source) y (target) pointers
mov acc x
mov 0 y

//                                               program should be prefixed its length, store it to count down
mov &x acc
add acc x
mov &acc w
mov &x acc

//                                               copy the source to the target
bootloader-copy_loop:
mov &x d
mov d &y

//                                               advance pointers
inc x
inc x
inc y
inc y

//                                               stop when we reach the end
dec acc
dec acc
jgz [!bootloader-copy_loop]

//                                               return value is the address of the start of the copied program
mov w &FP
rts
hlt

.org $bffe
.data16 reset_vector { !bootloader-start }