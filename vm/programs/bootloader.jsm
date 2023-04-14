.global_def _hardware.default_stack_pointer, $8fde;
.global_def _memory_map.hard_drive, $c000;

.org $b000;
.global_label _memory_map.rom:
.global_label bootloader.main:
    mov $ffff, CLK;
    //                                               mask all interrupts
    mov r0, IM;
    //                                               set the stack pointer
    mov !_hardware.default_stack_pointer, SP;
    //                                               load a program from sector 0
    mov (!_memory_map.hard_drive + $01), x;
    mov $6000, y;
    mov r0, mar;
    cal mar, [!_program.bootloader.bootloader.load_program_and_run];
    hlt;

.global_label _program.bootloader.bootloader.load_program_and_run:
    mov &FP, mar;
    cal mar, [!bootloader.load_file];
    mov &SP, mar;
    mov &mar, acc;
    add acc, mar;
    dec acc;
    dec acc;
    mov &acc, mar;
    brk [!bootloader.load_program_and_run.loaded];

.label bootloader.load_program_and_run.loaded:
    mov mar, PC;

//                                                         (x y d cal) = (target_addr source_addr jump_address sector_number)
.global_label _program.bootloader.bootloader.load_program_and_jump:
    psh d;
    cal mar, [!bootloader.load_file];
    pop PC;
    hlt;

//                                               loading a program: (x y cal) = (target_addr source_addr sector_number)
.global_label bootloader.bootloader.load_file:
.label bootloader.load_file:
//                                               mask all interrupts
    psh IM;
    mov r0, IM;

//                                               pass in argument
    mov &FP, mar;
    mov mar, [!_memory_map.hard_drive];

//                                               program should be prefixed by its length store it to count down
    mov &x, acc;
    cal acc, [!bootloader.mov_data];

    mov &SP, y;
    mov y, &FP;
    pop IM;
    rts;


//                                               copy a string from one memory location to the other: (x y cal) -> mov &x &y (cal times)
.global_label bootloader.mov_data:
    psh IM;
    mov r0, IM;

    mov &FP, acc;
    mov y, &FP;

    .label bootloader.mov_data.loop:
        mov &x, d;
        mov d, &y;

        inc x;
        inc x;
        inc y;
        inc y;

        sub acc, $02;
        jgz [!bootloader.mov_data.loop];

    pop IM;
    rts;

.org $bffe;
.global_data16 _hardware.default_reset_vector, {!bootloader.main};