.global_def font.red, 0b0000111100000000;
.global_def font.green, b0000000011110000;
.global_def font.blue, b0000000000001111;
.global_def font.clear_screen, b100000000000;
.global_def font.italics, b0100000000000000;
.global_def font.bold, b0010000000000000;

.global_def _memory_map.screen_address, $a000;
.global_def _memory_map.screen_address.end, $a751;
.global_def _memory_map.keyboard, $a751;
.global_def _memory_map.sleep_timer, $a752;
.global_def _memory_map.sound.noise, $a753;
.global_def _memory_map.sound.sine, $a754;
.global_def _memory_map.sound.square, $a755;
.global_def _memory_map.sound.sawtooth, $a756;

.global_def _hardware.interrupt_vector.keyboard, $8fe0;
.global_def _hardware.interrupt_vector.sound, $8fe2;

.org $6000;
.label file.start:
.data16 text.length, {(!reset.vector - !file.start + 2)};

.label OS.main:
    mov b1, IM;
    mov 0, [!_memory_map.sleep_timer];

    //                              initialize malloc
    mov $a000, [!mallocs + (4*0)];
    mov $4001, [!mallocs + (4*0) + 2];
    mov $ffff, [!mallocs + (4*1)];
    mov $ffff, [!mallocs + (4*1) + 2];


    mov (!font.green + !font.italics + !font.bold), [!_memory_map.screen_address];

    mov 'H, [!_memory_map.screen_address + 1];
    mov 'e, [!_memory_map.screen_address + 2];
    mov 'l, [!_memory_map.screen_address + 3];
    mov 'l, [!_memory_map.screen_address + 4];
    mov 'o, [!_memory_map.screen_address + 5];

    mov $20, [!_memory_map.screen_address + 6];

    mov 'W, [!_memory_map.screen_address + 7];
    mov 'o, [!_memory_map.screen_address + 8];
    mov 'r, [!_memory_map.screen_address + 9];
    mov 'l, [!_memory_map.screen_address + 10];
    mov 'd, [!_memory_map.screen_address + 11];
    mov '!, [!_memory_map.screen_address + 12];


.label OS.loop:
    jmp [!OS.loop];



//                          Just halts for now
.label OS.throw_fatal_error:
    hlt;



.global_label OS.reset:
    bki [!bootloader.main];



//                          Dummy function for debug
.label test_function:
    cal $0000, [!OS.free];
    rts;



//                          Call with the address of a callback function and the function will be called with keypress as argument
.global_label IO.on_key_press:
    mov &FP, mar;
    mov mar, [!key_press_callback];
    mov !IO.handle_key_press, [!_hardware.interrupt_vector.keyboard];
    rts;



.label IO.handle_key_press:
    mov [!_memory_map.keyboard], w;
    cal w, [!IO.key_press_callback.run];
    rti;

.label IO.key_press_callback.run:
    mov [!key_press_callback], PC;

.data16 key_press_callback, { !OS.reset };


//                          Call with address, frees up memory to be used again
.global_label OS.free:
    mov &FP, x;
    mov !mallocs, mar;

    .label OS.free.search:
        mov &mar, w;
        mov w, acc;
        
            jne $ffff, [!OS.free.memory_available];
            rts;
            .label OS.free.memory_available;

        add mar, 4;
        mov acc, mar;
        sub x, w;
        jnz [!OS.free.search];

    mov mar, x;
    sub mar, 4;
    mov acc, y;
    

    .label OS.free.found:
        mov &x, acc;
        mov acc, &y;

        inc x;
        inc x;
        inc y;
        inc y;

        jne $ffff, [!OS.free.found];
    
    mov $ffff, &y;
    rts;



//                          Call with a buffer size. Returns address at start of reserved block of memory
.global_label OS.malloc:
    mov &FP, d;
    mov 0, x;
    mov !mallocs, mar;

    .label OS.malloc.search:
        mov x, &FP;
        add x, d;
        mov &mar, w;
        jlt w, [!OS.malloc.found];

        mov w, acc;
        jne $ffff, [!OS.malloc.memory_available];
            cal 0, [!OS.throw_fatal_error];
        .label OS.malloc.memory_available:
    
        inc mar;
        inc mar;
        add x, w;
        mov acc, x;
        inc x;
        inc mar;
        inc mar;
        jmp [!OS.malloc.search];


        .label OS.malloc.found:
            mov &mar, w;
            mov x, &mar;
            inc mar;
            inc mar;
            mov &mar, acc;
            mov d, &mar;

            mov w, x;
            mov acc, d;

            inc mar;
            inc mar;

            jnz [!OS.malloc.found];
        rts;





.data16 reset.vector, {!OS.main};



.data16 mallocs, { $0000 };