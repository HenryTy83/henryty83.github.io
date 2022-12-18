//                                               useful global constants
.global _memory_map-program_mem $0000
.global _memory_map-working_mem $4000
.global _memory_map-screen_address $8000
.global _memory_map-hard_drive $c000

.global _hardware-default_stack_pointer $7ffe
.global _hardware-interrupt_vector $7fe0

.org $a000
.global_label _memory_map-rom:
bootloader-start:
//                                               mask all interrupts
mov 0 [!_hardware-interrupt_vector]
//                                               set the stack pointer
mov !_hardware-default_stack_pointer SP
//                                               load a program from sector 0
mov 0 x
mov 0 y

mov $ffff CLK
cal &1 [!_program-bootloader-load_program]
mov 1 CLK

mov [!_function-break] [!_hardware-interrupt_vector]
mov $ffff IM

mov &SP PC
hlt


//                                               loading a program: (x, y, cal) = (sector_number, target_addr, source_addr)
.global_label _program-bootloader-load_program:
//                                               mask all interrupts
mov 0 [!_hardware-interrupt_vector]
//                                               pass in arguments
mov x [!_memory_map-hard_drive]
mov &FP d
mov !_memory_map-hard_drive x
add d x

//                                               set x (source) y (target) pointers
mov acc x

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


//                                               setting up a break command
.global_label _function-break:
pop NUL
psh !bootloader-start
rti


.org $bffe
.global_data16 _hardware-default_reset_vector { !bootloader-start }