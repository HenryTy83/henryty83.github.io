//                                               useful global constants
.global _memory_map-program_mem $0000
.global _memory_map-working_mem $4000
.global _memory_map-screen_address $8000
.global _memory_map-keyboard $8751
.global _memory_map-sleep_timer $8752
.global _memory_map-hard_drive $c000

.global _hardware-default_stack_pointer $7fde
.global _hardware-interrupt_vector-keyboard $7fe0

.org $a000
.global_label _memory_map-rom:
function-main:
mov $ffff, CLK
//                                               mask all interrupts
mov 0, IM
//                                               set the stack pointer
mov !_hardware-default_stack_pointer, SP
//                                               load a program from sector 0
mov (!_memory_map-hard_drive + $01), x
mov 0, y
mov 0, mar
cal mar, [!_program-bootloader-function-load_program_and_run]
hlt

// 
.global_label _program-bootloader-function-load_program_and_run:
mov &FP, mar
cal mar, [!function-load_file]

//                                               set up an interrupt to reset on key press
mov !_software-reset, [!_hardware-interrupt_vector-keyboard]
mov 1, IM

//                                               start the sleep timer
mov 0, [!_memory_map-sleep_timer]
mov &SP, mar

brk [!function-load_program_and_run-loaded]

function-load_program_and_run-loaded:
mov mar, PC

//                                               if we halt here there is something wrong
hlt

//                                                         (x, y, d, cal) = (target_addr, source_addr, jump_address, sector_number)
.global_label _program-bootloader-function-load_program_and_jump:
psh d
cal mar, [!function-load_file]
pop PC
hlt

//                                               loading a program: (x, y, cal) = (target_addr, source_addr, sector_number)
.global_label bootloader-function-load_file:
function-load_file:
//                                               mask all interrupts
psh IM
mov 0, IM

//                                               pass in argument
mov &FP, mar
mov mar, [!_memory_map-hard_drive]

//                                               program should be prefixed by its length, store it to count down
mov &x, acc
jez [!function-load_file-end]
add acc, $02
cal acc, [!function-mov_data]

mov &SP, y
mov &y, acc
add acc, y
mov &acc, mar
mov mar, &FP
function-load_file-end:
pop IM
rts


//                                               copy a string from one memory location to the other: (x, y, cal) -> mov &x, &y (cal times)
.global_label function-mov_data:
psh IM
mov 0, IM

mov &FP, acc
mov y, &FP

function-mov_data-loop:
mov &x, d
mov d, &y

inc x
inc x
inc y
inc y

sub acc, $02
jgz [!function-mov_data-loop]

pop IM
rts

//                                               reset interrupt
.global_label _software-reset:
bki [!function-main]


.org $bffe
.global_data16 _hardware-default_reset_vector { !function-main }