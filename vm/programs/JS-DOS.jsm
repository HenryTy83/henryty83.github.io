.global_def font.red, 0b0000111100000000;
.global_def font.green, b0000000011110000;
.global_def font.blue, b0000000000001111;
.global_def font.clear_screen, b100000000000;
.global_def font.italics, b0100000000000000;
.global_def font.bold, b0010000000000000;

.global_def string.newline, $0a;

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

.global_def screen.chars_per_row, $4e;

.org $6000;
.label file.start:
.data16 text.length, {(!reset.vector - !file.start + 2)};

.label OS.main:
    mov b1, IM;
    mov r0, [!_memory_map.sleep_timer];

    //                              initialize malloc
    mov $a000, [!mallocs + (4*0)];
    mov $4001, [!mallocs + (4*0) + 2];
    mov $ffff, [!mallocs + (4*1)];
    mov $ffff, [!mallocs + (4*1) + 2];


    mov (!font.green), [!_memory_map.screen_address];
    
    mov r0, x;
    mov r0, y;
    cal [!IO.console.move_cursor];

    cal !hello_world_string, [!IO.console.print];

    hlt; 

.label OS.loop:
    jmp [!OS.loop];

.data16 hello_world_string, {'H, 'e, 'l, 'l, 'o, $20, 'W, 'o, 'r, 'l, 'd, '!, $0a,
'S, 'e, 'c, 'o, 'n, 'd, $20, 'l, 'i, 'n, 'e, $20, $263A, $00 };


//                          Just halts for now
.label OS.throw_fatal_error:
    hlt;



.global_label OS.reset:
    bki [!bootloader.main];



//                          Dummy function for debug
.label test_function:
    cal $0000, [!OS.free];
    rts;


.global_data16 IO.console.cursor.pos, { (!_memory_map.screen_address + 1) };
.global_data16 IO.console.cursor.pos.x, { 0 };
.global_data16 IO.console.cursor.pos.y, { 0 };

//                          Move the cursor to the coordinates in the x and y register
.global_label IO.console.move_cursor:
    mul y, !screen.chars_per_row;
    add acc, x;
    add acc, (!_memory_map.screen_address + 1);
    mov acc, [!IO.console.cursor.pos];
    mov acc, &FP;
    mov x, [!IO.console.cursor.pos.x];
    mov y, [!IO.console.cursor.pos.y];
    rts;

.global_label IO.console.set_cursor_pos:
    mov &FP, acc;
    mov acc, [!IO.console.cursor.pos];
    
    sub acc, !_memory_map.screen_address;
    mov r0, y;

    .label IO.console.set_cursor_pos.find_row;
        jlt !screen.chars_per_row, [!IO.console.set_cursor_pos.find_column];
        inc y;
        sub acc, !screen.chars_per_row;
        jmp [!IO.console.set_cursor_pos.find_row];
    
    .label IO.console.set_cursor_pos.find_column:
        mov acc, [!IO.console.cursor.pos.x];
        mov y, [!IO.console.cursor.pos.y];
        rts;

//                          Write a null-terminated string to the cursor pos
.global_label IO.console.print:
    mov &FP, x;
    mov [!IO.console.cursor.pos], y;
    mov x, &FP;
    
    mov &x, acc;
    jez [!IO.console.print.end];

    .label IO.console.print.loop:
        mov acc, &y;
        
        inc x;
        inc x;  
        inc y;

        .label IO.console.print.fetch_next_char:
            mov &x, acc;

            jne !string.newline, [!IO.console.print.check_end];

            psh x;
            mov y, [!IO.console.cursor.pos];
            cal [!IO.console.newline];
            mov &SP, y;
            pop x;
            inc x;
            inc x;
            jmp [!IO.console.print.fetch_next_char];

            .label IO.console.print.check_end:
                jnz [!IO.console.print.loop];
    
    mov y, [!IO.console.cursor.pos];
    .label IO.console.print.end:
    rts;

//                                  move the cursor to the next line
.global_label IO.console.newline:
    mov [!IO.console.cursor.pos], y;
    cal y, [!IO.console.set_cursor_pos];
    mov [!IO.console.cursor.pos.y], y;
    inc y;
    mov r0, x;
    cal [!IO.console.move_cursor];
    mov &SP, x;
    mov x, &FP;
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
    mov r0, x;
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