//                                               useful global constants
.global _memory_map-program_mem $0000
.global _memory_map-working_mem $4000
.global _memory_map-screen_address $8000
.global _memory_map-keyboard $8751
.global _memory_map-sleep_timer $8752
.global _memory_map-hard_drive $c000

.global _hardware-default_stack_pointer $7fde
.global _hardware-interrupt_vector-keyboard $7fe0
.global _hardware-interrupt_vector-sleep_timer $7fe0

.org $a000
.global_label _memory_map-rom:
bootloader-start:
//                                               mask all interrupts
mov 0, IM
//                                               set the stack pointer
mov !_hardware-default_stack_pointer, SP

//                                               load a program from sector 0
mov $ffff, CLK
mov (!_memory_map-hard_drive + $01), x
mov 0, y
cal &0, [!_program-bootloader-load_program]
mov 1, CLK

//                                               set up an interrupt to reset on key press
mov !_software-reset, [!_hardware-interrupt_vector-keyboard]
mov $ffff, IM

mov &SP, PC
hlt


//                                               loading a program: (x, y, cal) = (target_addr, source_addr, sector_number)
.global_label _program-bootloader-load_program:
//                                               mask all interrupts
psh IM
mov 0, IM

//                                               pass in argument
mov &FP, mar
mov mar, [!_memory_map-hard_drive]

//                                               program should be prefixed its length, store it to count down
mov &x, acc
add acc, $02
cal &acc, [!_program-mov_data]

mov &SP, y
mov &y, acc
add acc, y
mov &acc, mar
mov mar, &FP
rts


//                                               copy a string from one memory location to the other: (x, y, cal) -> mov &x, &y (cal times)
.global_label _program-mov_data:
psh IM
mov 0, IM

mov &FP, acc
mov y, &FP

_program-mov_data-loop:
mov &x, d
mov d, &y

inc x
inc x
inc y
inc y

sub acc, $02
jgz [!_program-mov_data-loop]

pop IM
rts


//                                               reset interrupt
.global_label _software-reset:
pop NUL
psh !bootloader-start
rti


.org $bffe
.global_data16 _hardware-default_reset_vector { !bootloader-start }